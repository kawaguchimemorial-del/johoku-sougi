import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CallButton } from "@/components/CallButton";
import { ColumnVisual } from "@/components/ColumnVisual";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, articleLd, faqLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, disclaimer } from "@/app/config/site";
import {
  columns,
  getColumn,
  getCategory,
  getCategoryName,
  columnImage,
} from "@/data/columns";

export function generateStaticParams() {
  return columns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const col = getColumn(slug);
  if (!col) return {};
  return buildMetadata({
    title: col.title,
    description: col.description,
    path: `/column/${col.slug}/`,
  });
}

export default async function ColumnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const col = getColumn(slug);
  if (!col) notFound();

  const category = getCategory(col.category);
  const related = (col.related ?? [])
    .map((s) => getColumn(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const path = `/column/${col.slug}/`;
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "葬儀コラム", path: "/column/" },
    { name: col.title, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          articleLd({
            title: col.title,
            description: col.description,
            path,
            updated: col.updated,
            image: columnImage(col) ?? undefined,
          }),
          ...(col.faq && col.faq.length > 0 ? [faqLd(col.faq)] : []),
        ]}
      />
      <Breadcrumbs items={crumbs} />

      {/* 記事ヘッダー */}
      <section className="bg-gradient-to-b from-navy to-navy-light py-10 text-white sm:py-12">
        <Container>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
            <span className="rounded-full bg-gold px-3 py-1 font-bold text-white">
              {getCategoryName(col.category)}
            </span>
            <span>約{col.readMin}分で読めます</span>
            <span>更新：{col.updated}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-relaxed sm:text-3xl">
            {col.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {col.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/85"
              >
                #{k}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <article className="py-10 sm:py-12">
        <Container className="max-w-3xl">
          {/* アイキャッチ（画像があれば画像、無ければSVG） */}
          <div className="overflow-hidden rounded-2xl border border-black/5 shadow-sm">
            <ColumnVisual
              src={columnImage(col)}
              illust={category?.illust ?? "flow"}
              alt={col.title}
              className="aspect-[16/7] w-full"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          {/* リード */}
          <p className="mt-7 text-lg leading-relaxed text-ink">{col.lead}</p>

          {/* この記事のポイント */}
          <div className="mt-8 rounded-2xl border border-gold/30 bg-cream p-6">
            <p className="flex items-center gap-2 font-bold text-navy">
              <span className="inline-block h-4 w-1 rounded bg-gold" />
              この記事のポイント
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed">
              {col.takeaways.map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden className="mt-1 text-gold">
                    ✓
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* この記事について（E-E-A-T：運営者・更新日・編集方針） */}
          <div className="mt-6 rounded-xl border border-black/10 bg-white p-5 text-sm shadow-sm">
            <p className="font-bold text-navy">この記事について</p>
            <dl className="mt-3 space-y-1.5 text-muted">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-bold text-ink">運営・編集：</dt>
                <dd>
                  {siteConfig.name}（運営・施行：{siteConfig.operator}）
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-bold text-ink">最終更新：</dt>
                <dd>{col.updated}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-bold text-ink">編集方針：</dt>
                <dd>
                  戸田斎場などを利用したお見送りの相談・施行で得た知見をもとに、
                  正確さと分かりやすさを重視して作成しています。
                </dd>
              </div>
            </dl>
            <p className="mt-3">
              <Link
                href="/company/"
                className="font-bold text-gold hover:underline"
              >
                運営者情報（川口典礼）を見る →
              </Link>
            </p>
          </div>

          {/* 本文 */}
          <div className="mt-9 space-y-9">
            {col.sections.map((s, i) => (
              <section key={s.heading}>
                <h2 className="border-l-4 border-gold pl-3 text-xl font-bold leading-snug text-navy sm:text-2xl">
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed">
                  {s.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {s.list && (
                  <ul className="mt-4 space-y-2 rounded-xl bg-cream p-5 text-sm leading-relaxed">
                    {s.list.map((li) => (
                      <li key={li} className="flex gap-2">
                        <span aria-hidden className="mt-1 text-gold">
                          ●
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

                {/* 本文の中ほどに自然な相談導線を挟む */}
                {i === Math.floor(col.sections.length / 2) && (
                  <InlineCallout />
                )}
              </section>
            ))}
          </div>

          {/* 記事内FAQ */}
          {col.faq && col.faq.length > 0 && (
            <div className="mt-10">
              <h2 className="border-l-4 border-gold pl-3 text-xl font-bold text-navy sm:text-2xl">
                よくあるご質問
              </h2>
              <dl className="mt-4 space-y-4">
                {col.faq.map((f) => (
                  <div
                    key={f.question}
                    className="rounded-xl border border-black/5 bg-white p-5 shadow-sm"
                  >
                    <dt className="font-bold text-navy">Q. {f.question}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted">
                      A. {f.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* 記事末の強い相談導線 */}
          <div className="mt-10 rounded-2xl bg-navy p-7 text-white sm:p-9">
            <p className="text-lg font-bold leading-relaxed sm:text-xl">
              {siteConfig.shortName}にご相談ください
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              記事はあくまで一般的な目安です。ご家庭ごとの事情に合わせた具体的なご案内・お見積りは、
              お電話がいちばん早く、確実です。「戸田斎場で考えている」とお伝えいただくだけで、
              空き状況の確認からスムーズにご案内します。24時間365日受付・ご相談お見積りは無料です。
            </p>
            <div className="mt-6 flex justify-center">
              <CallButton variant="light" />
            </div>
          </div>

          {/* 出典・免責（E-E-A-T） */}
          <div className="mt-6 rounded-xl border border-black/10 bg-cream p-5 text-xs leading-relaxed text-muted">
            <p className="font-bold text-navy">出典・ご利用にあたって</p>
            <ul className="mt-2 space-y-1.5">
              <li>
                ・本記事は、{siteConfig.operator}（{siteConfig.name}）が、
                葬儀の相談・施行で得た知見をもとに作成した一般的な情報です。
              </li>
              <li>
                ・制度・手続き・費用・税・相続などの詳細や最新の取り扱いは、
                市区町村・年金事務所・税務署などの公的窓口、または専門家（税理士・司法書士・弁護士など）に
                必ずご確認ください。
              </li>
              <li>
                ・価格に触れる場合も、表示は目安（税込）で、内容・人数・地域により費用が変わることがあります。
              </li>
              <li>・{disclaimer}</li>
            </ul>
            <p className="mt-3">
              <a
                href={siteConfig.parentSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gold hover:underline"
              >
                {siteConfig.parentSiteName} →
              </a>
            </p>
          </div>

          {/* 関連記事 */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold text-navy">関連する記事</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/column/${r.slug}/`}
                    className="group rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="text-[11px] font-bold text-gold">
                      {getCategoryName(r.category)}
                    </span>
                    <h3 className="mt-1 text-sm font-bold leading-snug text-navy group-hover:text-navy-light">
                      {r.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/column/"
              className="text-sm font-bold text-gold hover:underline"
            >
              ← 葬儀コラム一覧に戻る
            </Link>
          </div>
        </Container>
      </article>

      <CtaSection />
    </>
  );
}

// 本文の途中に挟む、控えめな相談導線。
function InlineCallout() {
  return (
    <div className="my-7 flex flex-col gap-3 rounded-xl border border-gold/30 bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm leading-relaxed text-ink">
        <span className="font-bold text-navy">
          読みながら不安に感じたら、いつでもどうぞ。
        </span>
        <br className="hidden sm:block" />
        個別のご相談・お見積りは無料です（24時間365日）。
      </p>
      <div className="shrink-0">
        <CallButton />
      </div>
    </div>
  );
}
