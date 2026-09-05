import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlanCard } from "@/components/PlanCard";
import { JsonLd } from "@/components/JsonLd";
import { ContentSections } from "@/components/ContentSections";
import { FaqBlock } from "@/components/FaqBlock";
import { RelatedColumns } from "@/components/RelatedColumns";
import { breadcrumbLd, faqLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { disclaimer } from "@/app/config/site";
import {
  areas,
  getArea,
  areaTitle,
  areaDescription,
  areaHeroLead,
  areaFeaturedNote,
} from "@/data/areas";
import { getHall } from "@/data/halls";
import { plans } from "@/data/plans";

export function generateStaticParams() {
  return areas.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) return {};
  return buildMetadata({
    title: areaTitle(area),
    description: areaDescription(area),
    path: area.href,
  });
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const featuredHalls = area.featuredHalls
    .map((s) => getHall(s))
    .filter((h): h is NonNullable<typeof h> => Boolean(h));

  const localHalls = area.localHalls
    .map((s) => getHall(s))
    .filter((h): h is NonNullable<typeof h> => Boolean(h));

  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: `${area.name}の葬儀相談`, path: area.href },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), faqLd(area.faq)]} />
      <Breadcrumbs items={crumbs} />
      <PageHero title={area.lead} lead={areaHeroLead(area)} />

      <section className="py-12">
        <Container>
          {area.intro.map((p) => (
            <p key={p} className="mb-4 leading-relaxed">
              {p}
            </p>
          ))}
        </Container>
      </section>

      <section className="bg-cream py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            {area.name}から利用できる斎場
          </h2>
          <p className="mt-4 leading-relaxed">{areaFeaturedNote(area)}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {featuredHalls.map((h) => (
              <Link
                key={h.slug}
                href={h.href}
                className="inline-block rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                {h.name}について詳しく見る →
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            {disclaimer}
          </p>
        </Container>
      </section>

      {/* 本文セクション（全体像・通夜と告別式・斎場と火葬場・費用・形式の選び方 など） */}
      <section className="py-12">
        <Container>
          <ContentSections sections={area.sections} />
        </Container>
      </section>

      <section className="bg-cream py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            {area.name}でのご葬儀の形式
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {plans.map((p) => (
              <PlanCard key={p.slug} plan={p} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            ※ 表示価格は目安です。内容により費用が変わる場合があります。正確な費用は個別にお見積りします。
          </p>
        </Container>
      </section>

      {localHalls.length > 0 && (
        <section className="py-12">
          <Container>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              {area.name}から利用しやすい式場（選択肢の一例）
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {localHalls.map((h) => (
                <div
                  key={h.slug}
                  className="rounded-xl border border-black/5 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-navy">{h.name}</h3>
                  <p className="mt-1 text-xs text-muted">{h.area}</p>
                  <p className="mt-2 text-sm">{h.summary}</p>
                </div>
              ))}
            </div>
            <Link
              href="/hall/"
              className="mt-5 inline-block text-sm font-bold text-gold hover:underline"
            >
              斎場一覧を見る →
            </Link>
          </Container>
        </section>
      )}

      {/* ページ内FAQ */}
      <section className="bg-cream py-12">
        <Container>
          <FaqBlock
            items={area.faq}
            title={`${area.name}の葬儀に関するよくあるご質問`}
          />
        </Container>
      </section>

      {/* 関連コラム */}
      <section className="py-12">
        <Container>
          <RelatedColumns slugs={area.relatedColumns} />
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
