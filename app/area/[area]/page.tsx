import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlanCard } from "@/components/PlanCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { areas, getArea } from "@/data/areas";
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
    title: `${area.name}の葬儀相談｜戸田斎場・一日葬・火葬式・家族葬`,
    description: `${area.name}で葬儀をご検討の方へ。戸田斎場を利用した一日葬・火葬式・直葬・家族葬のご相談を、城北セレモニーサポートセンター（運営・施行：川口典礼）が承ります。24時間365日受付。`,
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
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHero title={area.lead} lead={area.keywords.join("・")} />

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
          <p className="mt-4 leading-relaxed">
            {area.name}からは、火葬場が併設された戸田斎場が利用しやすく、移動の負担を抑えながらお見送りができます。
            {featuredHalls.some((h) => h.slug === "funado-saijo") &&
              "あわせて、板橋区内の舟渡斎場もご利用いただけます。"}
            通夜を行わない一日葬、火葬を中心とした火葬式・直葬、ご家族中心の家族葬など、
            ご希望や参列人数に合わせて、斎場・形式をお選びいただけます。
          </p>
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
        </Container>
      </section>

      <section className="py-12">
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
        <section className="bg-cream py-12">
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

      <CtaSection />
    </>
  );
}
