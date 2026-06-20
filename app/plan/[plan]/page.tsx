import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PriceNote } from "@/components/PriceNote";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { plans, getPlan, formatPrice } from "@/data/plans";

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
    title: `${plan.name}｜北区・板橋区・戸田斎場での${plan.name}相談`,
    description: `${plan.name}は${plan.summary}北区・板橋区で戸田斎場を利用した${plan.name}のご相談を、城北セレモニーサポートセンター（運営・施行：川口典礼）が承ります。目安${formatPrice(plan.price)}。`,
    path: plan.href,
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

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHero title={`${plan.name}`} lead={plan.summary} />

      <section className="py-12">
        <Container>
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
              <h3 className="font-bold text-navy">北区で葬儀をお考えの方</h3>
              <p className="mt-1 text-sm text-muted">
                北区から戸田斎場を利用する場合の考え方。
              </p>
            </Link>
            <Link
              href="/area/itabashi-ku/"
              className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-gold/40"
            >
              <h3 className="font-bold text-navy">板橋区で葬儀をお考えの方</h3>
              <p className="mt-1 text-sm text-muted">
                板橋区から戸田斎場を利用する場合の考え方。
              </p>
            </Link>
            {others.map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-gold/40"
              >
                <h3 className="font-bold text-navy">{p.name}</h3>
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
