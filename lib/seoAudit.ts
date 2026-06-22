// 社内SEOチェック用：全ページの実効 title / description / keywords を一元集約する。
// 各ページの generateMetadata と同じ式を再現している。式を変えたらここも合わせること。

import { siteConfig } from "@/app/config/site";
import { halls } from "@/data/halls";
import { plans, formatPrice } from "@/data/plans";
import { areas } from "@/data/areas";
import { columns } from "@/data/columns";

export type PageType = "トップ" | "斎場" | "プラン" | "エリア" | "コラム" | "固定";

export type PageSeo = {
  path: string;
  type: PageType;
  title: string; // 実際に出力される <title>（サイト名込み）
  description: string;
  keywords: string[];
};

// buildMetadata と同じ <title> を組み立てる（非トップは社名を付けない）
function fullTitle(title: string, path: string): string {
  return path === "/"
    ? `${siteConfig.name}｜北区・板橋区の葬儀相談窓口`
    : title;
}

// 固定ページ（title は buildMetadata に渡している「サイト名前の部分」）
const staticPages: { path: string; title: string; description: string; type: PageType }[] = [
  {
    path: "/",
    title: "",
    description: siteConfig.description,
    type: "トップ",
  },
  {
    path: "/hall/",
    title: "対応斎場一覧｜戸田斎場・舟渡斎場・北区セレモニーホールほか",
    description:
      "城北セレモニーサポートセンターが対応する斎場の一覧です。戸田斎場、舟渡斎場、北区セレモニーホール、蓮根レインボーホールなど、北区・板橋区周辺の式場のご相談を承ります。",
    type: "固定",
  },
  {
    path: "/column/",
    title: "葬儀コラム｜費用・流れ・形式・マナーをやさしく解説",
    description:
      "北区・板橋区で葬儀をご検討の方へ。葬儀の流れ・費用・一日葬や家族葬などの形式・斎場・手続き・マナーまで、知りたいテーマから探せる葬儀コラムです。運営・施行は川口典礼。",
    type: "固定",
  },
  {
    path: "/faq/",
    title: "よくある質問｜戸田斎場・一日葬・火葬式・直葬の相談",
    description:
      "北区・板橋区から戸田斎場を利用した葬儀について、よくある質問をまとめました。一日葬・火葬式・直葬・家族葬、搬送、空き確認、お見積りなど。運営・施行は川口典礼です。",
    type: "固定",
  },
  {
    path: "/contact/",
    title: "ご相談・お見積り",
    description:
      "城北セレモニーサポートセンターへのご相談・お見積りのご案内です。24時間365日、お電話で受け付けています。病院・施設からのお迎え、安置先のご相談、斎場の空き確認、お見積りまで対応します。",
    type: "固定",
  },
  {
    path: "/company/",
    title: "運営者情報",
    description:
      "城北セレモニーサポートセンターの運営者情報です。運営・施行は川口典礼。対応エリアは東京都北区・板橋区および周辺地域。一日葬・火葬式・直葬・家族葬、斎場相談、搬送、安置相談、見積り相談に対応します。",
    type: "固定",
  },
  {
    path: "/privacy/",
    title: "プライバシーポリシー",
    description:
      "城北セレモニーサポートセンター（運営・施行：川口典礼）のプライバシーポリシーです。お客様の個人情報の取り扱いについてご案内します。",
    type: "固定",
  },
];

// 全ページの SEO 情報を集約
export function getAllPageSeo(): PageSeo[] {
  const list: PageSeo[] = [];

  for (const p of staticPages) {
    list.push({
      path: p.path,
      type: p.type,
      title: fullTitle(p.title, p.path),
      description: p.description,
      keywords: [],
    });
  }

  for (const h of halls) {
    const title = `${h.name}での葬儀｜一日葬・火葬式・直葬・家族葬の相談`;
    list.push({
      path: h.href,
      type: "斎場",
      title: fullTitle(title, h.href),
      description: `${h.name}での葬儀をご検討の方へ。${h.summary}一日葬・火葬式・直葬・家族葬のご相談、空き状況の確認を、城北セレモニーサポートセンター（運営・施行：川口典礼）が承ります。`,
      keywords: h.keywords,
    });
  }

  for (const p of plans) {
    const title = `${p.name}｜北区・板橋区・戸田斎場での${p.name}相談`;
    list.push({
      path: p.href,
      type: "プラン",
      title: fullTitle(title, p.href),
      description: `${p.name}は${p.summary}北区・板橋区で戸田斎場を利用した${p.name}のご相談を、城北セレモニーサポートセンター（運営・施行：川口典礼）が承ります。目安${formatPrice(p.price)}。`,
      keywords: p.keywords,
    });
  }

  for (const a of areas) {
    const title = `${a.name}の葬儀相談｜戸田斎場・一日葬・火葬式・家族葬`;
    list.push({
      path: a.href,
      type: "エリア",
      title: fullTitle(title, a.href),
      description: `${a.name}で葬儀をご検討の方へ。戸田斎場を利用した一日葬・火葬式・直葬・家族葬のご相談を、城北セレモニーサポートセンター（運営・施行：川口典礼）が承ります。24時間365日受付。`,
      keywords: a.keywords,
    });
  }

  for (const c of columns) {
    list.push({
      path: `/column/${c.slug}/`,
      type: "コラム",
      title: fullTitle(c.title, `/column/${c.slug}/`),
      description: c.description,
      keywords: c.keywords,
    });
  }

  return list;
}

// 文字数（全角・絵文字も1としてカウント）
export const charLen = (s: string): number => Array.from(s).length;

export type SeoIssue = {
  level: "warn" | "info";
  message: string;
};

// 推奨レンジ（日本語表示の目安）
export const TITLE_MAX = 35; // <title> 全体。これ超で SERP 末尾が切れやすい
export const DESC_MIN = 80;
export const DESC_MAX = 120;

// 1ページ分のチェック
export function checkPage(
  page: PageSeo,
  dupTitles: Set<string>,
  dupDescs: Set<string>,
): SeoIssue[] {
  const issues: SeoIssue[] = [];
  const tLen = charLen(page.title);
  const dLen = charLen(page.description);

  if (tLen > TITLE_MAX)
    issues.push({ level: "warn", message: `title が長い（${tLen}字／目安${TITLE_MAX}字以下）` });
  if (dLen < DESC_MIN)
    issues.push({ level: "info", message: `description が短い（${dLen}字／目安${DESC_MIN}〜${DESC_MAX}字）` });
  if (dLen > DESC_MAX)
    issues.push({ level: "warn", message: `description が長い（${dLen}字／目安${DESC_MIN}〜${DESC_MAX}字）` });
  if (dupTitles.has(page.title))
    issues.push({ level: "warn", message: "title が他ページと重複" });
  if (dupDescs.has(page.description))
    issues.push({ level: "warn", message: "description が他ページと重複" });
  if (
    (page.type === "斎場" || page.type === "プラン" || page.type === "エリア") &&
    page.keywords.length === 0
  )
    issues.push({ level: "info", message: "keywords 未設定" });

  return issues;
}

// 重複している title / description の集合を返す
export function findDuplicates(pages: PageSeo[]): {
  titles: Set<string>;
  descs: Set<string>;
} {
  const titleCount = new Map<string, number>();
  const descCount = new Map<string, number>();
  for (const p of pages) {
    titleCount.set(p.title, (titleCount.get(p.title) ?? 0) + 1);
    descCount.set(p.description, (descCount.get(p.description) ?? 0) + 1);
  }
  const titles = new Set<string>();
  const descs = new Set<string>();
  for (const [k, v] of titleCount) if (v > 1) titles.add(k);
  for (const [k, v] of descCount) if (v > 1) descs.add(k);
  return { titles, descs };
}
