import Link from "next/link";
import type { ContentSection } from "@/data/content";

// プランページ・エリアページの本文セクションを描画する共通コンポーネント。
// 見出し・段落・箇条書き・表（横スクロール可）に対応する。
export function ContentSections({
  sections,
  headingLevel = "h2",
}: {
  sections: ContentSection[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <section key={s.heading}>
          <Heading className="border-l-4 border-gold pl-3 text-xl font-bold text-navy sm:text-2xl">
            {s.heading}
          </Heading>

          {s.paragraphs.map((p) => (
            <p key={p} className="mt-4 leading-relaxed">
              {p}
            </p>
          ))}

          {s.list && s.list.length > 0 && (
            <ul className="mt-4 space-y-2">
              {s.list.map((li) => (
                <li key={li} className="flex gap-2 leading-relaxed">
                  <span aria-hidden className="text-gold">
                    ✓
                  </span>
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          )}

          {s.table && (
            <figure className="mt-5">
              {s.table.caption && (
                <figcaption className="mb-2 text-sm font-bold text-navy">
                  {s.table.caption}
                </figcaption>
              )}
              <div className="overflow-x-auto rounded-xl border border-black/10">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-navy text-white">
                      {s.table.headers.map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap px-4 py-3 text-left font-bold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((row, ri) => (
                      <tr
                        key={row.join("|")}
                        className={ri % 2 === 0 ? "bg-white" : "bg-cream"}
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className="border-t border-black/5 px-4 py-3 align-top leading-relaxed"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {s.table.note && (
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {s.table.note}
                </p>
              )}
            </figure>
          )}

          {s.links && s.links.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
              {s.links.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="text-gold hover:underline"
                >
                  {l.label} →
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
