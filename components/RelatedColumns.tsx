import Link from "next/link";
import { getColumn } from "@/data/columns";

// 関連コラムへの導線。存在しない slug は黙って除外する（ビルドを落とさない）。
export function RelatedColumns({
  slugs,
  title = "関連する解説記事",
}: {
  slugs: string[];
  title?: string;
}) {
  const items = slugs
    .map((s) => getColumn(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-navy sm:text-2xl">{title}</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/column/${c.slug}/`}
              className="block h-full rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-gold/40"
            >
              <span className="block font-bold leading-snug text-navy">
                {c.title}
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-muted">
                {c.lead.length > 80 ? `${c.lead.slice(0, 80)}…` : c.lead}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
