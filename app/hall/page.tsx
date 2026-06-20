import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { halls } from "@/data/halls";

export const metadata: Metadata = buildMetadata({
  title: "対応斎場一覧｜戸田斎場・舟渡斎場・北区セレモニーホールほか",
  description:
    "城北セレモニーサポートセンターが対応する斎場の一覧です。戸田斎場、舟渡斎場、北区セレモニーホール、蓮根レインボーホールなど、北区・板橋区周辺の式場のご相談を承ります。",
  path: "/hall/",
});

export default function HallListPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "斎場一覧", path: "/hall/" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHero
        title="対応斎場一覧"
        lead="北区・板橋区周辺で、ご葬儀にご利用いただける主な斎場をご案内します。"
      />

      <section className="py-12">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            {halls.map((h) => (
              <div
                key={h.slug}
                className="flex flex-col rounded-xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-bold text-navy">{h.name}</h2>
                <p className="mt-1 text-xs text-muted">{h.area}</p>
                <p className="mt-2 flex-1 text-sm">{h.summary}</p>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {h.points.map((pt) => (
                    <li key={pt} className="flex gap-1.5">
                      <span className="text-gold">●</span>
                      {pt}
                    </li>
                  ))}
                </ul>
                {h.hasDetail && (
                  <Link
                    href={h.href}
                    className="mt-4 inline-block text-sm font-bold text-gold hover:underline"
                  >
                    詳しく見る →
                  </Link>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted">
            ※ 各斎場の利用条件・式場料金は内容や時期により異なります。詳しくはお電話でお問い合わせください。
          </p>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
