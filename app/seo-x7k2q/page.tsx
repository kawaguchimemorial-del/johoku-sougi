import type { Metadata } from "next";
import {
  getAllPageSeo,
  checkPage,
  findDuplicates,
  charLen,
  TITLE_MAX,
  DESC_MIN,
  DESC_MAX,
  type SeoIssue,
} from "@/lib/seoAudit";
import { keywordRanks } from "@/data/seoKeywords";
import {
  fetchSearchConsole,
  isSearchConsoleConfigured,
  type ScResult,
  type ScRow,
} from "@/lib/searchConsole";

// 裏ページ：検索エンジンに出さない（Basic認証は proxy.ts で保護）
export const metadata: Metadata = {
  title: "SEOチェック（非公開）",
  robots: { index: false, follow: false, nocache: true },
};

// Search Console を毎回取得するため動的レンダリング（Node ランタイム）
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// 共通スタイル（このページ専用・素朴な管理画面）
const th = "border border-slate-300 bg-slate-100 px-2 py-1 text-left text-xs font-semibold text-slate-700";
const td = "border border-slate-200 px-2 py-1 text-xs align-top";

function IssueBadges({ issues }: { issues: SeoIssue[] }) {
  if (issues.length === 0)
    return <span className="text-green-700">OK</span>;
  return (
    <ul className="space-y-0.5">
      {issues.map((i, n) => (
        <li
          key={n}
          className={i.level === "warn" ? "text-red-700" : "text-amber-700"}
        >
          {i.level === "warn" ? "⚠ " : "・ "}
          {i.message}
        </li>
      ))}
    </ul>
  );
}

export default async function SeoDashboardPage() {
  const pages = getAllPageSeo();
  const { titles: dupTitles, descs: dupDescs } = findDuplicates(pages);

  // Search Console 実測データ（未設定なら null、エラーならメッセージを保持）
  let sc: ScResult | null = null;
  let scError: string | null = null;
  if (isSearchConsoleConfigured()) {
    try {
      sc = await fetchSearchConsole(28);
    } catch (e) {
      scError = e instanceof Error ? e.message : String(e);
    }
  }
  // クエリ→実測の対応（順位記録表へのマージ用）。
  // Search Console のクエリは半角/全角スペースの揺れがあるため、空白を除去した
  // 正規化キーで突合する（例「戸田斎場 葬儀」⇔「戸田斎場　葬儀」）。
  // 正規化後に衝突した場合は表示回数の多い行を採用（決定的マージ・黙って上書きしない）。
  const normKw = (s: string) => s.replace(/[\s　]/g, "");
  const scByQuery = new Map<string, ScRow>();
  for (const r of sc?.rows ?? []) {
    const key = normKw(r.query);
    const prev = scByQuery.get(key);
    if (!prev || r.impressions > prev.impressions) scByQuery.set(key, r);
  }

  // 各ページのチェック
  const rows = pages.map((p) => ({
    page: p,
    issues: checkPage(p, dupTitles, dupDescs),
  }));
  const warnCount = rows.filter((r) =>
    r.issues.some((i) => i.level === "warn"),
  ).length;

  // キーワード→ページ対応（カニバリ検出）。
  // コラムの keywords は「絞り込みタグ（費用・マナー等）」でSEOの狙いKWではないため除外し、
  // 斎場・プラン・エリアの狙いKWだけで重複を見る。
  const targetTypes = new Set(["斎場", "プラン", "エリア"]);
  const kwToPages = new Map<string, string[]>();
  for (const p of pages) {
    if (!targetTypes.has(p.type)) continue;
    for (const kw of p.keywords) {
      const arr = kwToPages.get(kw) ?? [];
      arr.push(p.path);
      kwToPages.set(kw, arr);
    }
  }
  const cannibals = [...kwToPages.entries()]
    .filter(([, paths]) => paths.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-slate-800">
      <header className="mb-6">
        <h1 className="text-xl font-bold">SEOチェック（非公開・社内用）</h1>
        <p className="mt-1 text-sm text-slate-600">
          このページは検索エンジンに出さない設定（noindex＋Basic認証）です。
          外部公開・サイトマップ・ナビには載せていません。
        </p>
        <p className="mt-1 text-xs text-slate-500">
          全{pages.length}ページ／要対応（⚠）<strong className="text-red-700">{warnCount}</strong>ページ。
          目安：title ≤ {TITLE_MAX}字、description {DESC_MIN}〜{DESC_MAX}字。
        </p>
      </header>

      {/* 1. 社内SEOチェック一覧 */}
      <section className="mb-10">
        <h2 className="mb-2 text-base font-bold">1. 社内SEOチェック一覧</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={th}>種別</th>
                <th className={th}>パス</th>
                <th className={th}>title（字数）</th>
                <th className={th}>description（字数）</th>
                <th className={th}>判定</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ page, issues }) => (
                <tr key={page.path}>
                  <td className={td}>{page.type}</td>
                  <td className={td}>
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 underline"
                    >
                      {page.path}
                    </a>
                  </td>
                  <td className={td}>
                    <div>{page.title}</div>
                    <div className="text-slate-400">{charLen(page.title)}字</div>
                  </td>
                  <td className={td}>
                    <div>{page.description}</div>
                    <div className="text-slate-400">
                      {charLen(page.description)}字
                    </div>
                  </td>
                  <td className={td}>
                    <IssueBadges issues={issues} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. 主要KWの順位記録表 */}
      <section className="mb-10">
        <h2 className="mb-2 text-base font-bold">2. 主要キーワードの順位記録表</h2>
        <p className="mb-2 text-xs text-slate-500">
          {sc
            ? "Search Console 実測（直近28日）が取得できたキーワードは「実測」列に自動表示（緑）します。半角/全角スペースの揺れは吸収して突合します。手入力も実測も無く、実測クエリにも存在しないものは、直近28日で表示ゼロ＝「圏外」と表示します（バグではなく、そのキーワードでまだ検索表示されていない状態）。"
            : "Search Console 未接続のため手入力（data/seoKeywords.ts）を表示中。接続するとここに実測値が自動表示されます（下の「4. Search Console 実測」を参照）。"}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={th}>キーワード</th>
                <th className={th}>狙うページ</th>
                <th className={th}>平均掲載順位</th>
                <th className={th}>表示回数</th>
                <th className={th}>クリック</th>
                <th className={th}>出所</th>
                <th className={th}>メモ</th>
              </tr>
            </thead>
            <tbody>
              {keywordRanks.map((k, i) => {
                const live = scByQuery.get(normKw(k.keyword));
                const pos = live?.position ?? k.position;
                const imp = live?.impressions ?? k.impressions;
                const clk = live?.clicks ?? k.clicks;
                // 実測にも手入力にも無い場合の理由を区別して表示する。
                //  ・SC接続済みで該当クエリが無い → 直近28日は表示ゼロ＝「圏外」
                //  ・SC未接続 → まだ取得できていない＝「—」
                const offRange = sc != null && !live && k.position == null;
                const src = live
                  ? "SC実測"
                  : k.updated
                    ? `手入力(${k.updated})`
                    : offRange
                      ? "圏外"
                      : "—";
                const dash = offRange ? "圏外" : "—";
                return (
                  <tr key={i} className={live ? "bg-green-50" : undefined}>
                    <td className={td}>{k.keyword}</td>
                    <td className={td}>
                      <a
                        href={k.targetPath}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 underline"
                      >
                        {k.targetPath}
                      </a>
                    </td>
                    <td className={td}>{pos != null ? pos.toFixed(1) : dash}</td>
                    <td className={td}>{imp ?? dash}</td>
                    <td className={td}>{clk ?? dash}</td>
                    <td className={td}>
                      <span
                        className={live ? "text-green-700" : "text-slate-400"}
                      >
                        {src}
                      </span>
                    </td>
                    <td className={td}>{k.note ?? ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. キーワード→ページ対応表（カニバリ検出） */}
      <section className="mb-10">
        <h2 className="mb-2 text-base font-bold">
          3. キーワード→ページ対応表（カニバリ検出）
        </h2>
        <p className="mb-2 text-xs text-slate-500">
          斎場・プラン・エリアの狙いキーワードを集計。同じキーワードを複数ページが狙っている場合は、検索意図が割れる（カニバリ）可能性があります。
          （コラムの <code>keywords</code> は絞り込みタグのため対象外）
        </p>
        {cannibals.length === 0 ? (
          <p className="text-sm text-green-700">
            複数ページで重複しているキーワードはありません。
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={th}>キーワード</th>
                  <th className={th}>狙っているページ数</th>
                  <th className={th}>該当ページ</th>
                </tr>
              </thead>
              <tbody>
                {cannibals.map(([kw, paths]) => (
                  <tr key={kw}>
                    <td className={td}>{kw}</td>
                    <td className={td}>
                      <span className="text-red-700">{paths.length}</span>
                    </td>
                    <td className={td}>
                      {paths.map((p) => (
                        <div key={p}>{p}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 4. Search Console 実測（自動取得） */}
      <section className="mb-10">
        <h2 className="mb-2 text-base font-bold">
          4. Search Console 実測（検索クエリ・直近28日）
        </h2>

        {sc ? (
          <>
            <p className="mb-2 text-xs text-slate-500">
              プロパティ <code>{sc.site}</code>／期間 {sc.range.start}〜{sc.range.end}
              （表示回数の多い順・上位{Math.min(sc.rows.length, 100)}件）。
            </p>
            {sc.rows.length === 0 ? (
              <p className="text-sm text-amber-700">
                データがまだありません（インデックス直後・表示回数が少ない場合は空になります）。
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className={th}>検索クエリ</th>
                      <th className={th}>平均掲載順位</th>
                      <th className={th}>表示回数</th>
                      <th className={th}>クリック</th>
                      <th className={th}>CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...sc.rows]
                      .sort((a, b) => b.impressions - a.impressions)
                      .slice(0, 100)
                      .map((r) => (
                        <tr key={r.query}>
                          <td className={td}>{r.query}</td>
                          <td className={td}>{r.position.toFixed(1)}</td>
                          <td className={td}>{r.impressions}</td>
                          <td className={td}>{r.clicks}</td>
                          <td className={td}>{(r.ctr * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : scError ? (
          <div className="rounded border border-red-300 bg-red-50 p-3 text-xs text-slate-700">
            <p className="font-semibold text-red-700">接続エラー</p>
            <p className="mt-1 break-all">{scError}</p>
            <p className="mt-2 text-slate-500">
              環境変数（GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY /
              SC_SITE_URL）と、サービスアカウントが Search Console
              プロパティに登録されているかをご確認ください。
            </p>
          </div>
        ) : (
          <div className="rounded border border-amber-300 bg-amber-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-semibold text-amber-800">
              診断（本番envの有無・値は表示しません）:
            </p>
            <ul className="mb-2 ml-4 list-disc text-slate-600">
              <li>
                GOOGLE_SERVICE_ACCOUNT_EMAIL:{" "}
                {process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? "設定済" : "未設定"}
              </li>
              <li>
                GOOGLE_PRIVATE_KEY:{" "}
                {process.env.GOOGLE_PRIVATE_KEY
                  ? process.env.GOOGLE_PRIVATE_KEY.includes("BEGIN")
                    ? "設定済（PEM形式OK）"
                    : "設定済（※BEGIN行なし・貼り方要確認）"
                  : "未設定"}
              </li>
              <li>
                SC_SITE_URL:{" "}
                {process.env.SC_SITE_URL
                  ? process.env.SC_SITE_URL
                  : "未設定（既定 sc-domain:johoku-sougi.jp を使用）"}
              </li>
            </ul>
            <p className="mb-2 font-semibold">
              上記が「未設定」なら、Vercel に登録して再デプロイすれば直ります。手順（あなた側）:
            </p>
            <ol className="ml-4 list-decimal space-y-0.5">
              <li>Google Cloud でプロジェクト作成 → 「Search Console API」を有効化</li>
              <li>サービスアカウントを作成し、JSON キー（鍵）を発行</li>
              <li>
                Search Console のプロパティ「設定 → ユーザーと権限 →
                ユーザーを追加」で、サービスアカウントのメールを「制限付き」で追加
              </li>
              <li>
                Vercel の環境変数に設定：<br />
                <code>GOOGLE_SERVICE_ACCOUNT_EMAIL</code>（サービスアカウントのメール）<br />
                <code>GOOGLE_PRIVATE_KEY</code>（JSONの private_key の値）<br />
                <code>SC_SITE_URL</code>（既定 <code>sc-domain:johoku-sougi.jp</code>）
              </li>
              <li>再デプロイ → このページを開くと自動表示されます</li>
            </ol>
            <p className="mt-2 text-slate-500">
              ※ 未接続の間は「2. 順位記録表」に手入力で運用できます。
            </p>
          </div>
        )}
      </section>

      <footer className="mt-8 border-t border-slate-200 pt-3 text-xs text-slate-400">
        城北セレモニーサポートセンター 内部用ダッシュボード
      </footer>
    </div>
  );
}
