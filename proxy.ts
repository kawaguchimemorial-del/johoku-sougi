import { NextRequest, NextResponse } from "next/server";

// 裏ページ（SEOチェック）だけを Basic 認証で保護する。
// パスワードは環境変数 SEO_PASS で設定（Vercel の Environment Variables / ローカルは .env.local）。
// ユーザー名は任意（空でも可）、パスワードのみ照合する。
export const config = {
  matcher: ["/seo-x7k2q", "/seo-x7k2q/:path*"],
};

function unauthorized(message: string) {
  return new NextResponse(message, {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="SEO", charset="UTF-8"' },
  });
}

// 定数時間比較（タイミング攻撃対策）。
// 両者の SHA-256 ダイジェストを比較することで長さを揃え、全バイトを XOR で走査する。
// Web Crypto API を使うため Node.js / Edge どちらのランタイムでも動作する。
async function safeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [da, db] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const va = new Uint8Array(da);
  const vb = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

export default async function proxy(req: NextRequest) {
  const pass = process.env.SEO_PASS;

  // 環境変数が未設定なら安全側で常に閉じる（誤って公開しないため）
  if (!pass) {
    return unauthorized("SEO_PASS 未設定のため非公開です。");
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      // Basic 認証の値は UTF-8 として復号する（realm で charset="UTF-8" を宣言しているため）
      const bytes = Uint8Array.from(atob(auth.slice(6)), (c) => c.charCodeAt(0));
      const decoded = new TextDecoder().decode(bytes);
      const idx = decoded.indexOf(":");
      const pw = idx >= 0 ? decoded.slice(idx + 1) : decoded;
      if (await safeEqual(pw, pass)) return NextResponse.next();
    } catch {
      // デコード失敗は未認証扱い
    }
  }

  return unauthorized("認証が必要です。");
}
