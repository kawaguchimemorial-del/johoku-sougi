import { siteConfig, disclaimer, operatorFacts, priceNotes } from "@/app/config/site";
import { halls } from "@/data/halls";
import { plans } from "@/data/plans";
import { areas, areaHeroLead } from "@/data/areas";
import { columns } from "@/data/columns";

// AI検索（ChatGPT / Perplexity / AI Overviews 等）向けのサイト案内（GEO）。
// /llms.txt で配信。データから自動生成するため記事追加にも追従する。
export const dynamic = "force-static";

function abs(path: string) {
  return `${siteConfig.url}${path}`;
}

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(`> ${siteConfig.description}`);
  lines.push("");
  lines.push(disclaimer);
  lines.push("");
  lines.push(`- サイト: ${siteConfig.url}`);
  lines.push(`- 運営・施行: ${siteConfig.operator}`);
  lines.push(`- 電話: ${siteConfig.tel}（${siteConfig.telNote}）`);
  lines.push(`- 対応エリア: ${siteConfig.areas.join("・")}`);
  lines.push("");

  // AI が引用しやすい「事実ブロック」（数値は運営会社の確定事実のみ）
  lines.push("## 要点（事実）");
  lines.push(`- 運営・施行は${operatorFacts.legalName}（創業${operatorFacts.foundedYear}年、所在地：${operatorFacts.address}、自社式場：${operatorFacts.hallName}）。`);
  lines.push(`- 施行実績：累計${operatorFacts.cumulativeCases}、年間${operatorFacts.annualCases}（川口典礼全体。川口市などでの施行を含む）。`);
  lines.push(`- Google口コミ：★${operatorFacts.googleRating}（${operatorFacts.googleReviewCount}件、${operatorFacts.hallName}、2026年9月確認）。`);
  lines.push(`- ${operatorFacts.visitNote}`);
  lines.push("- 主に利用する斎場：戸田斎場（東京都板橋区舟渡4-15-1・火葬場併設）、舟渡斎場、北区セレモニーホール、蓮根レインボーホール、町屋斎場（荒川区・火葬場併設）。");
  lines.push("- 区民葬儀（北区・板橋区の区民葬）の指定葬儀社ではない。区民葬儀との違いは比較してご説明する。");
  for (const p of plans)
    lines.push(`- ${p.name}のプラン料金の目安：${p.price.toLocaleString("ja-JP")}円（税込）。式場使用料・火葬料金・宗教者へのお礼・返礼品・飲食費などは別途。`);
  for (const n of priceNotes) lines.push(`- ${n}`);
  lines.push(`- 最終更新：${new Date().toISOString().slice(0, 10)}`);
  lines.push("");

  lines.push("## 主要ページ");
  lines.push(`- [対応斎場一覧](${abs("/hall/")})`);
  lines.push(`- [葬儀コラム](${abs("/column/")})`);
  lines.push(`- [よくある質問](${abs("/faq/")})`);
  lines.push(`- [ご相談・お見積り](${abs("/contact/")})`);
  lines.push(`- [運営者情報](${abs("/company/")})`);
  lines.push("");

  lines.push("## 葬儀プラン");
  for (const p of plans) lines.push(`- [${p.name}](${abs(p.href)}): ${p.summary}`);
  lines.push("");

  lines.push("## 対応斎場");
  for (const h of halls) lines.push(`- [${h.name}](${abs(h.href)}): ${h.area}。${h.summary}`);
  lines.push("");

  lines.push("## 対応エリア");
  for (const a of areas) lines.push(`- [${a.name}の葬儀相談](${abs(a.href)}): ${areaHeroLead(a)}`);
  lines.push("");

  lines.push("## コラム記事");
  for (const c of columns)
    lines.push(`- [${c.title}](${abs(`/column/${c.slug}/`)}): ${c.description}`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
