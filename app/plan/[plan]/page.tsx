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
import { breadcrumbLd, serviceLd, faqLd, webPageLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { planFormValue } from "@/app/contact/options";
import { PageCta } from "@/components/PageCta";
import { CheckedDate } from "@/components/CheckedDate";
import { VoiceList } from "@/components/VoiceList";
import { voices } from "@/data/voices";
import { disclaimer } from "@/app/config/site";
import {
  plans,
  getPlan,
  planTitle,
  planDescription,
  planHeading,
} from "@/data/plans";
import { areas, getArea } from "@/data/areas";
import { halls, getHall } from "@/data/halls";

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
  // このプランの区別セクションで案内している斎場（重複なし・登場順）
  const relatedHalls = halls.filter((h) =>
    plan.areaNotes.some((n) => n.halls.includes(h.slug)),
  );

  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: plan.name, path: plan.href },
  ];

  // このプランに近い形式の声を優先して3件（足りなければ他の声で補う）
  const planWords: Record<string, string[]> = {
    "one-day-funeral": ["一日葬"],
    "direct-funeral": ["直葬", "火葬式"],
    "family-funeral": ["家族葬"],
  };
  const words = planWords[plan.slug] ?? [];
  const planVoices = [
    ...voices.filter((v) => words.includes(v.plan)),
    ...voices.filter((v) => !words.includes(v.plan)),
  ].slice(0, 3);

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
            price: plan.price,
          }),
          faqLd(plan.faq),
          webPageLd({ name: planHeading(plan), path: plan.href }),
        ]}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero
        title={planHeading(plan)}
        lead={plan.summary}
        cta
        ctaLocation="plan_hero"
        ctaQuery={`plan=${planFormValue[plan.slug] ?? "undecided"}`}
        formLabel={`${plan.name}の見積りを依頼する`}
      />

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

          <div className="mt-6 rounded-2xl border border-gold/30 bg-cream p-6 sm:p-8">
            <p className="text-sm font-bold text-gold-deep">{plan.scale}</p>
            <p className="mt-3 text-xs text-muted">プラン料金の目安（税込）</p>
            <p className="font-serif text-[34px] font-bold leading-tight text-navy tabular-nums">
              {plan.price.toLocaleString("ja-JP")}
              <span className="ml-0.5 text-base">円</span>
            </p>
            <p className="mt-2 text-sm font-bold text-navy">
              式場使用料・火葬料金、宗教者へのお礼・返礼品・飲食費などは別途。総額の目安は、斎場・人数をうかがって個別にお見積りします。
            </p>
            <PriceNote />
            <CheckedDate className="mt-2" />
            <PageCta
              location="plan_price"
              query={`plan=${planFormValue[plan.slug] ?? "undecided"}&type=estimate`}
              formLabel={`${plan.name}の見積りを依頼する`}
              className="mt-6"
            />
          </div>

          <h2 className="mt-10 font-serif text-[22px] font-bold leading-snug text-navy sm:text-[28px]">
            {plan.name}の特長
          </h2>
          <ul className="mt-4 space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-gold-deep">✓</span>
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

      {planVoices.length > 0 && (
        <section className="py-12">
          <Container>
            <h2 className="font-serif text-[22px] font-bold leading-snug text-navy sm:text-[28px]">
              ご葬儀を終えたご家族の声
            </h2>
            <div className="mt-6">
              <VoiceList items={planVoices} />
            </div>
          </Container>
        </section>
      )}

      {/* 区ごとの案内 */}
      <section className="py-12">
        <Container>
          <h2 className="font-serif text-[22px] font-bold leading-snug text-navy sm:text-[28px]">
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
                  <h3 className="relative pt-4 before:absolute before:left-0 before:top-0 before:h-px before:w-8 before:bg-gold-deep text-lg font-bold text-navy sm:text-xl">
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
                        className="inline-flex min-h-8 items-center text-gold-deep hover:underline"
                      >
                        {area.name}の葬儀のご相談について →
                      </Link>
                    )}
                    {halls.map((h) => (
                      <Link
                        key={h.slug}
                        href={h.href}
                        className="inline-flex min-h-8 items-center text-gold-deep hover:underline"
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
          <h2 className="font-serif text-[22px] font-bold leading-snug text-navy sm:text-[28px]">
            あわせてご覧ください
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {relatedHalls.map((h) => (
              <Link
                key={h.slug}
                href={h.href}
                className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-gold/40"
              >
                <h3 className="font-bold text-navy">{h.name}について</h3>
                <p className="mt-1 text-sm text-muted">{h.summary}</p>
              </Link>
            ))}
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/area/${a.slug}/`}
                className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-gold/40"
              >
                <h3 className="font-bold text-navy">
                  {a.name}の葬儀・葬式のご相談
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {a.name}での斎場の選び方と、通夜から火葬までの流れ。
                </p>
              </Link>
            ))}
            {others.map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className="rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-gold/40"
              >
                <h3 className="font-bold text-navy">
                  {p.name}（北区・板橋区・足立区）
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
