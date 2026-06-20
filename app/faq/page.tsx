import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, faqLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = buildMetadata({
  title: "よくある質問｜戸田斎場・一日葬・火葬式・直葬の相談",
  description:
    "北区・板橋区から戸田斎場を利用した葬儀について、よくある質問をまとめました。一日葬・火葬式・直葬・家族葬、搬送、空き確認、お見積りなど。運営・施行は川口典礼です。",
  path: "/faq/",
});

export default function FaqPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "よくある質問", path: "/faq/" },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), faqLd(faqs)]} />
      <Breadcrumbs items={crumbs} />
      <PageHero
        title="よくある質問"
        lead="戸田斎場のご利用や、一日葬・火葬式・直葬・家族葬についてよくいただくご質問です。"
      />

      <section className="py-12">
        <Container>
          <dl className="space-y-6">
            {faqs.map((f) => (
              <div
                key={f.question}
                className="rounded-xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <dt className="font-bold text-navy">Q. {f.question}</dt>
                <dd className="mt-2 leading-relaxed text-muted">
                  A. {f.answer}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
