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
          <Heading className="relative pt-4 before:absolute before:left-0 before:top-0 before:h-px before:w-8 before:bg-gold-deep font-serif text-[22px] font-bold leading-snug text-navy sm:text-[28px]">
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
                  <span aria-hidden className="text-gold-deep">
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
              {/* スマホ：行ごとのカード（多列の表が細切れにならないように） */}
              <ul className="space-y-3 md:hidden">
                {s.table.rows.map((row) => (
                  <li
                    key={row.join("|")}
                    className="rounded-xl border border-black/10 bg-white p-4"
                  >
                    <p className="font-bold text-navy">{row[0]}</p>
                    <dl className="mt-2 space-y-1.5 text-sm">
                      {row.slice(1).map((cell, ci) => (
                        <div key={ci} className="grid grid-cols-[6.5em_1fr] gap-2">
                          <dt className="text-muted">{s.table!.headers[ci + 1]}</dt>
                          <dd className="leading-relaxed">{cell}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ul>
              <div className="hidden overflow-x-auto rounded-xl border border-black/10 md:block">
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
                            className={`border-t border-black/5 px-3 py-3 align-top leading-relaxed sm:px-4 ${
                              ci === 0 ? "min-w-[7.5em] font-bold text-navy" : "min-w-[9em]"
                            }`}
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
                  className="text-gold-deep hover:underline"
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
