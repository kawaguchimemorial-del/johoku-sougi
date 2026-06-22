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

// 裏ページ：検索エンジンに出さない（Basic認証は middleware.ts で保護）
export const metadata: Metadata = {
  title: "SEOチェック（非公開）",
  robots: { index: false, follow: false, nocache: true },
};

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

export default function SeoDashboardPage() {
  const pages = getAllPageSeo();
  const { titles: dupTitles, descs: dupDescs } = findDuplicates(pages);

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
          Search Console の「検索パフォーマンス」で見た平均掲載順位を{" "}
          <code>data/seoKeywords.ts</code> に手入力すると、ここに反映されます。
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
                <th className={th}>記録日</th>
                <th className={th}>メモ</th>
              </tr>
            </thead>
            <tbody>
              {keywordRanks.map((k, i) => (
                <tr key={i}>
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
                  <td className={td}>
                    {k.position != null ? k.position.toFixed(1) : "—"}
                  </td>
                  <td className={td}>{k.impressions ?? "—"}</td>
                  <td className={td}>{k.clicks ?? "—"}</td>
                  <td className={td}>{k.updated ?? "—"}</td>
                  <td className={td}>{k.note ?? ""}</td>
                </tr>
              ))}
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

      {/* 4. Search Console 自動連携（フェーズ2） */}
      <section className="mb-10">
        <h2 className="mb-2 text-base font-bold">
          4. Search Console 自動連携（未接続）
        </h2>
        <div className="rounded border border-amber-300 bg-amber-50 p-3 text-xs text-slate-700">
          <p className="mb-2">
            平均掲載順位・表示回数・CTR を Search Console API
            から自動取得する機能は、Google
            のサービスアカウント作成と権限付与が必要です。準備ができたら接続します。
          </p>
          <p className="font-semibold">必要な準備（あなた側）:</p>
          <ol className="ml-4 list-decimal space-y-0.5">
            <li>Google Cloud でプロジェクト作成 → Search Console API を有効化</li>
            <li>サービスアカウントを作成し、JSON キーを取得</li>
            <li>
              Search Console
              のプロパティ設定で、そのサービスアカウントのメールを「ユーザーを追加（制限付き）」で登録
            </li>
            <li>
              JSON キーを Vercel の環境変数に設定（実装時に変数名を案内します）
            </li>
          </ol>
          <p className="mt-2">
            ※ それまでは「2. 順位記録表」に手入力で運用できます。
          </p>
        </div>
      </section>

      <footer className="mt-8 border-t border-slate-200 pt-3 text-xs text-slate-400">
        城北セレモニーサポートセンター 内部用ダッシュボード
      </footer>
    </div>
  );
}
