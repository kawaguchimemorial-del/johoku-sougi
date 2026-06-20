import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { disclaimer } from "@/app/config/site";
import { getHall } from "@/data/halls";
import { plans, formatPrice } from "@/data/plans";

const hall = getHall("toda-saijo")!;

export const metadata: Metadata = buildMetadata({
  title: "戸田斎場での葬儀｜一日葬・火葬式・直葬・家族葬の相談",
  description:
    "戸田斎場で葬儀をご検討の方へ。火葬場併設で移動の負担を抑えやすい斎場です。一日葬・火葬式・直葬・家族葬のご相談、空き状況の確認を、城北セレモニーサポートセンター（運営・施行：川口典礼）が承ります。",
  path: hall.href,
});

const flow = [
  "お電話で「戸田斎場で考えている」とご相談ください（24時間365日受付）",
  "病院・施設へのお迎え、ご安置先のご相談に対応します",
  "ご希望の形式・参列人数をうかがい、空き状況とお見積りをご案内します",
  "戸田斎場でお見送り。施行は川口典礼が担当します",
];

export default function TodaSaijoPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "斎場一覧", path: "/hall/" },
    { name: "戸田斎場", path: hall.href },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHero
        title="戸田斎場での葬儀"
        lead="火葬場併設で移動の負担を抑えやすい斎場。一日葬・火葬式・直葬・家族葬に対応します。"
      />

      <section className="py-12">
        <Container>
          {hall.description.map((p) => (
            <p key={p} className="mb-4 leading-relaxed">
              {p}
            </p>
          ))}
          <ul className="mt-4 space-y-2">
            {hall.points.map((pt) => (
              <li key={pt} className="flex gap-2">
                <span className="text-gold">✓</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-cream py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            戸田斎場で葬儀を行う場合の流れ
          </h2>
          <ol className="mt-6 space-y-3">
            {flow.map((f, i) => (
              <li
                key={f}
                className="flex gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <span className="font-bold text-gold">{i + 1}</span>
                <span>{f}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            戸田斎場で対応できる形式
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {plans.map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className="group flex flex-col rounded-xl border border-black/5 bg-white p-6 shadow-sm transition hover:border-gold/40 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-navy">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{p.summary}</p>
                <p className="mt-3 font-bold text-navy">
                  目安 {formatPrice(p.price)}
                </p>
                <span className="mt-3 text-sm font-bold text-gold group-hover:underline">
                  詳しく見る →
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            ※ 表示価格は目安です。内容により費用が変わる場合があります。正確な費用は個別にお見積りします。
          </p>
        </Container>
      </section>

      <section className="bg-cream py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            空き状況の確認・ご相談
          </h2>
          <p className="mt-4 leading-relaxed">
            戸田斎場の空き状況の確認だけでも、お電話でご相談いただけます。
            「戸田斎場で考えている」とお伝えいただければ、スムーズにご案内できます。
          </p>
          <p className="mt-4 rounded-md bg-white p-4 text-sm leading-relaxed text-muted">
            {disclaimer}
          </p>
        </Container>
      </section>

      <CtaSection heading="戸田斎場の空き確認・ご相談はお電話で" />
    </>
  );
}
