import { columns, type Column } from "@/data/columns";
import { plans } from "@/data/plans";
import { areas } from "@/data/areas";

// 内部リンクの逆引き（各コラムへ、データで定義されたリンクが何本入っているか）。
// ビルド時に計算し、被リンクの少ないコラムを「同じカテゴリの記事」で優先的に紹介して孤立を防ぐ。
const inbound = new Map<string, number>();
const add = (slug: string) => inbound.set(slug, (inbound.get(slug) ?? 0) + 1);
for (const c of columns) for (const s of c.related ?? []) add(s);
for (const p of plans) for (const s of p.relatedColumns ?? []) add(s);
for (const a of areas) for (const s of a.relatedColumns ?? []) add(s);

export function inboundCount(slug: string): number {
  return inbound.get(slug) ?? 0;
}

// 同じカテゴリのほかの記事（関連記事と重複させず、被リンクの少ない順）。
export function sameCategoryColumns(col: Column, limit = 4): Column[] {
  const exclude = new Set([col.slug, ...(col.related ?? [])]);
  const idx = columns.findIndex((c) => c.slug === col.slug);
  return columns
    .filter((c) => c.category === col.category && !exclude.has(c.slug))
    // 同数なら記事の並び順で自分の次から巡回（特定記事への偏りを防ぐ）
    .map((c) => ({
      c,
      n: inboundCount(c.slug),
      d: (columns.indexOf(c) - idx + columns.length) % columns.length,
    }))
    .sort((a, b) => a.n - b.n || a.d - b.d)
    .slice(0, limit)
    .map((x) => x.c);
}
