import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PriceNote } from "@/components/PriceNote";
import { JsonLd } from "@/components/JsonLd";
import { ContentSections } from "@/components/ContentSections";
import { FaqBlock } from "@/components/FaqBlock";
import { RelatedColumns } from "@/components/RelatedColumns";
import { breadcrumbLd, serviceLd, faqLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { disclaimer } from "@/app/config/site";
import {
  plans,
  getPlan,
  formatPrice,
  planTitle,
  planDescription,
  planHeading,
} from "@/data/plans";
import { getArea } from "@/data/areas";
import { getHall } from "@/data/halls";

export function generateStaticParams() {
  return plans.map((p) => ({ plan: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ plan: string }>;
}): Promise<Metadata> {
  const { plan: slug } = await params;
  const plan = getPlan(slug);
  if (!plan) return {};
  return buildMetadata({
    title: planTitle(plan),
    description: planDescription(plan),
    path: plan.href,
    image: plan.image,
  });
}

export default async function PlanPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const { plan: slug } = await params;
  const plan = getPlan(slug);
  if (!plan) notFound();

  const others = plans.filter((p) => p.slug !== plan.slug);

  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: plan.name, path: plan.href },
  ];

  // areaNotes に登場する区を Service の areaServed に反映する
  const servedAreas = plan.areaNotes
    .map((n) => getArea(n.areaSlug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => `東京都${a.name}`);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          serviceLd({
            name: plan.name,
            description: plan.summary,
            path: plan.href,
            areaServed: servedAreas,
          }),
          faqLd(plan.faq),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero title={planHeading(plan)} lead={plan.summary} />

      <section className="py-12">
        <Container>
          {/* プランのイメージ画像（スマホで大きすぎないよう高さを抑える） */}
          <figure className="mb-8 overflow-hidden rounded-xl border border-black/5 shadow-sm">
            <div className="relative aspect-[16/9] max-h-[420px] w-full bg-cream">
              <Image
                src={plan.image}
                alt={plan.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
              />
            </div>
            <figcaption className="bg-cream px-4 py-2 text-xs text-muted">
              祭壇・お見送りの一例です。写真はイメージを含み、内容やご要望により設えは異なります。
            </figcaption>
          </figure>

          {plan.description.map((p) => (
            <p key={p} className="mb-4 leading-relaxed">
              {p}
            </p>
          ))}

          <div className="mt-6 rounded-xl border border-black/5 bg-cream p-6">
            <p className="text-sm font-bold text-gold">{plan.scale}</p>
            <p className="mt-2 text-2xl font-bold text-navy">
              目安 {formatPrice(plan.price)}
            </p>
            <PriceNote />
          </div>

          <h2 className="mt-10 text-xl font-bold text-navy sm:text-2xl">
            {plan.name}の特長
          </h2>
          <ul className="mt-4 space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-gold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 本文セクション（流れ・費用の内訳・注意点・他形式との比較） */}
      <section className="bg-cream py-12">
        <Container>
          <ContentSections sections={plan.sections} />
          <p className="mt-8 text-xs leading-relaxed text-muted">
            {disclaimer}
          </p>
        </Container>
      </section>

      {/* 区ごとの案内 */}
      <section className="py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            エリア別の{plan.name}のご案内
          </h2>
          <div className="mt-6 space-y-10">
            {plan.areaNotes.map((note) => {
              const area = getArea(note.areaSlug);
              const halls = note.halls
                .map((s) => getHall(s))
                .filter((h): h is NonNullable<typeof h> => Boolean(h));

              return (
                <div key={note.areaSlug}>
                  <h3 className="border-l-4 border-gold pl-3 text-lg font-bold text-navy sm:text-xl">
                    {note.heading}
                  </h3>
                  {note.paragraphs.map((p) => (
                    <p key={p} className="mt-4 leading-relaxed">
                      {p}
                    </p>
                  ))}
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                    {area && (
                      <Link
                        href={area.href}
                        className="text-gold hover:underline"
                      >
                        {area.name}の葬儀のご相談について →
                      </Link>
                    )}
                    {halls.map((h) => (
                      <Link
                        key={h.slug}
                        href={h.href}
                        className="text-gold hover:underline"
                      >
                        {h.name}について →
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ページ内FAQ */}
      <section className="bg-cream py-12">
        <Container>
          <FaqBlock items={plan.faq} title={`${plan.name}のよくあるご質問`} />
        </Container>
      </section>

      {/* 関連コラム */}
      <section className="py-12">
        <Container>
          <RelatedColumns slugs={plan.relatedColumns} />
        </Container>
      </section>

      {/* 関連導線 */}
      <section className="bg-cream py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            あわせてご覧ください
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/hall/toda-saijo/"
              className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-gold/40"
            >
              <h3 className="font-bold text-navy">戸田斎場について</h3>
              <p className="mt-1 text-sm text-muted">
                火葬場併設で移動の負担を抑えやすい斎場での進め方。
              </p>
            </Link>
            <Link
              href="/area/kita-ku/"
              className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-gold/40"
            >
              <h3 className="font-bold text-navy">北区の葬儀・葬式のご相談</h3>
              <p className="mt-1 text-sm text-muted">
                北区での斎場の選び方と、通夜から火葬までの流れ。
              </p>
            </Link>
            <Link
              href="/area/itabashi-ku/"
              className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-gold/40"
            >
              <h3 className="font-bold text-navy">
                板橋区の葬儀・葬式のご相談
              </h3>
              <p className="mt-1 text-sm text-muted">
                舟渡斎場・戸田斎場の使い方と費用の考え方。
              </p>
            </Link>
            {others.map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-gold/40"
              >
                <h3 className="font-bold text-navy">
                  {p.name}（北区・板橋区）
                </h3>
                <p className="mt-1 text-sm text-muted">{p.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
