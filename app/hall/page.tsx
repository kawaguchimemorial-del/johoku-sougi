import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HallCard } from "@/components/HallCard";
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
              <HallCard key={h.slug} hall={h} />
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
