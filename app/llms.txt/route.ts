import { siteConfig, disclaimer } from "@/app/config/site";
import { halls } from "@/data/halls";
import { plans } from "@/data/plans";
import { areas } from "@/data/areas";
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

  lines.push("## 主要ページ");
  lines.push(`- [対応斎場一覧](${abs("/hall/")})`);
  lines.push(`- [葬儀コラム](${abs("/column/")})`);
  lines.push(`- [よくある質問](${abs("/faq/")})`);
  lines.push(`- [ご相談・お見積り](${abs("/contact/")})`);
  lines.push(`- [運営者情報](${abs("/company/")})`);
  lines.push("");

  lines.push("## 葬儀プラン");
  for (const p of plans) lines.push(`- [${p.name}](${abs(p.href)})`);
  lines.push("");

  lines.push("## 対応斎場");
  for (const h of halls) lines.push(`- [${h.name}](${abs(h.href)})`);
  lines.push("");

  lines.push("## 対応エリア");
  for (const a of areas) lines.push(`- [${a.name}の葬儀相談](${abs(a.href)})`);
  lines.push("");

  lines.push("## コラム記事");
  for (const c of columns)
    lines.push(`- [${c.title}](${abs(`/column/${c.slug}/`)})`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
