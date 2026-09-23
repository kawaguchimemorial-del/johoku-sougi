import type { MetadataRoute } from "next";
import { siteConfig, contentCheckedAt } from "@/app/config/site";
import { plans } from "@/data/plans";
import { areas } from "@/data/areas";
import { halls } from "@/data/halls";
import { columns } from "@/data/columns";

type Entry = MetadataRoute.Sitemap[number];

// 固定ページ・斎場・プラン・エリアは「掲載内容の最終確認日」、記事は各 updated を使う。
// （ビルドのたびに全URLの lastmod が変わると、更新シグナルとして信用されなくなるため）
const buildDate = contentCheckedAt;

function entry(
  path: string,
  opts: {
    priority?: number;
    changeFrequency?: Entry["changeFrequency"];
    lastModified?: string | Date;
  } = {},
): Entry {
  return {
    url: `${siteConfig.url}${path}`,
    lastModified: opts.lastModified ?? buildDate,
    changeFrequency: opts.changeFrequency ?? "monthly",
    priority: opts.priority ?? 0.7,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // トップ
    entry("/", { priority: 1.0, changeFrequency: "weekly" }),
    // 主要（ピラー）ページ
    entry("/hall/", { priority: 0.9 }),
    entry("/column/", { priority: 0.9, changeFrequency: "weekly" }),
    entry("/contact/", { priority: 0.8 }),
    entry("/faq/", { priority: 0.8 }),
    entry("/company/", { priority: 0.6 }),
    entry("/privacy/", { priority: 0.3, changeFrequency: "yearly" }),
    // 斎場・プラン・エリア
    ...halls.map((h) => entry(h.href, { priority: 0.8 })),
    ...plans.map((p) => entry(p.href, { priority: 0.8 })),
    ...areas.map((a) => entry(a.href, { priority: 0.8 })),
    // コラム（各記事の更新日を lastModified に反映）
    ...columns.map((c) =>
      entry(`/column/${c.slug}/`, {
        priority: 0.6,
        lastModified: c.updated,
      }),
    ),
  ];
}
