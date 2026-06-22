// Google Search Console API クライアント（依存ライブラリなし・Node標準のみ）。
// サービスアカウントの JWT を自前で署名 → アクセストークン取得 → Search Console を叩く。
//
// 必要な環境変数:
//   GOOGLE_SERVICE_ACCOUNT_EMAIL … サービスアカウントのメール
//   GOOGLE_PRIVATE_KEY            … サービスアカウントJSONの private_key（\n はそのままでも可）
//   SC_SITE_URL                  … プロパティ識別子。ドメインプロパティは "sc-domain:johoku-sougi.jp"（既定）
//                                   URLプレフィックスなら "https://johoku-sougi.jp/"

import crypto from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const DEFAULT_SITE = "sc-domain:johoku-sougi.jp";

export type ScRow = {
  query: string;
  position: number; // 平均掲載順位
  impressions: number; // 表示回数
  clicks: number; // クリック数
  ctr: number; // クリック率（0〜1）
};

export type ScResult = {
  rows: ScRow[];
  range: { start: string; end: string };
  site: string;
};

// 設定済みかどうか
export function isSearchConsoleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY,
  );
}

async function getAccessToken(
  email: string,
  privateKey: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const enc = (obj: unknown) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");
  const header = enc({ alg: "RS256", typ: "JWT" });
  const claim = enc({
    iss: email,
    scope: SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  });
  const unsigned = `${header}.${claim}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(privateKey).toString("base64url");
  const assertion = `${unsigned}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`token取得失敗 (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("access_token がありません");
  return json.access_token;
}

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

// 直近 days 日（Search Console はデータ反映に2〜3日かかるため終端を3日前にする）
export async function fetchSearchConsole(days = 28): Promise<ScResult> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const site = process.env.SC_SITE_URL || DEFAULT_SITE;
  if (!email || !rawKey) throw new Error("環境変数が未設定です");

  // Vercel等に1行で貼ると \n がエスケープされるため復元
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const token = await getAccessToken(email, privateKey);

  const end = new Date(Date.now() - 3 * 86400000);
  const start = new Date(end.getTime() - days * 86400000);

  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      site,
    )}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: fmtDate(start),
        endDate: fmtDate(end),
        dimensions: ["query"],
        rowLimit: 200,
        dataState: "all",
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`searchAnalytics失敗 (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as {
    rows?: { keys: string[]; position: number; impressions: number; clicks: number; ctr: number }[];
  };
  const rows: ScRow[] = (data.rows ?? []).map((r) => ({
    query: r.keys[0],
    position: r.position,
    impressions: r.impressions,
    clicks: r.clicks,
    ctr: r.ctr,
  }));
  return { rows, range: { start: fmtDate(start), end: fmtDate(end) }, site };
}
