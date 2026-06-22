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

export default function proxy(req: NextRequest) {
  const pass = process.env.SEO_PASS;

  // 環境変数が未設定なら安全側で常に閉じる（誤って公開しないため）
  if (!pass) {
    return unauthorized("SEO_PASS 未設定のため非公開です。");
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const idx = decoded.indexOf(":");
      const pw = idx >= 0 ? decoded.slice(idx + 1) : decoded;
      if (pw === pass) return NextResponse.next();
    } catch {
      // デコード失敗は未認証扱い
    }
  }

  return unauthorized("認証が必要です。");
}
