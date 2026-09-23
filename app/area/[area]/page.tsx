import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { PageCta } from "@/components/PageCta";
import { CheckedDate } from "@/components/CheckedDate";
import { VoiceList } from "@/components/VoiceList";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlanCard } from "@/components/PlanCard";
import { JsonLd } from "@/components/JsonLd";
import { ContentSections } from "@/components/ContentSections";
import { FaqBlock } from "@/components/FaqBlock";
import { RelatedColumns } from "@/components/RelatedColumns";
import { breadcrumbLd, faqLd, webPageLd } from "@/lib/jsonld";
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
      <JsonLd data={[breadcrumbLd(crumbs), faqLd(area.faq), webPageLd({ name: area.lead, path: area.href })]} />
      <Breadcrumbs items={crumbs} />
      <PageHero
        title={area.lead}
        lead={areaHeroLead(area)}
        cta
        image={featuredHalls[0]?.image}
        imageAlt={featuredHalls[0] ? `${featuredHalls[0].name}の外観` : ""}
        ctaLocation="area_hero"
        ctaQuery={`area=${area.slug.replace("-ku", "")}`}
      />

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
          <h2 className="font-serif text-[22px] font-bold leading-snug text-navy sm:text-[28px]">
            {area.name}の方によく選ばれている斎場
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
          <CheckedDate className="mt-6" />
          <div className="mt-10 rounded-2xl bg-navy p-6 text-white sm:p-8">
            <p className="font-serif text-xl font-bold">
              {area.name}からのご葬儀、斎場の空き確認・お見積りはお気軽に
            </p>
            <p className="mt-2 text-sm leading-[1.85] text-white/80">
              ご希望の斎場・形式・人数をうかがい、プラン料金・斎場の料金・変動する費用を分けて総額の目安をお伝えします。
            </p>
            <PageCta
              location="area_mid"
              query={`area=${area.slug.replace("-ku", "")}&type=estimate`}
              invert
              className="mt-5"
            />
          </div>
        </Container>
      </section>

      <section className="bg-cream py-12">
        <Container>
          <h2 className="font-serif text-[22px] font-bold leading-snug text-navy sm:text-[28px]">
            一日葬・火葬式・家族葬のプラン料金の目安
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
            <h2 className="font-serif text-[22px] font-bold leading-snug text-navy sm:text-[28px]">
              {area.name}内・近隣の式場
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
              className="mt-5 inline-block text-sm font-bold text-gold-deep hover:underline"
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

      <section className="bg-cream py-12">
        <Container>
          <h2 className="font-serif text-[22px] font-bold leading-snug text-navy sm:text-[28px]">
            ご葬儀を終えたご家族の声
          </h2>
          <div className="mt-6">
            <VoiceList />
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
