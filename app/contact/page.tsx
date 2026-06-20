import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CallButton } from "@/components/CallButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, ctaText } from "@/app/config/site";

export const metadata: Metadata = buildMetadata({
  title: "ご相談・お見積り",
  description:
    "城北セレモニーサポートセンターへのご相談・お見積りのご案内です。24時間365日、お電話で受け付けています。病院・施設からのお迎え、安置先のご相談、斎場の空き確認、お見積りまで対応します。",
  path: "/contact/",
});

export default function ContactPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "ご相談・お見積り", path: "/contact/" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHero
        title="ご相談・お見積り"
        lead="まずは「戸田斎場で考えている」とお電話ください。24時間365日受け付けています。"
      />

      <section className="py-12">
        <Container>
          <div className="rounded-xl border border-black/5 bg-cream p-8 text-center shadow-sm">
            <p className="text-navy">お電話でのご相談（無料）</p>
            <div className="mt-5 flex justify-center">
              <CallButton />
            </div>
            <p className="mt-4 text-sm text-muted">{ctaText.primary}</p>
          </div>

          <h2 className="mt-12 text-xl font-bold text-navy sm:text-2xl">
            こんなご相談を承っています
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ctaText.appeals.map((a) => (
              <li
                key={a}
                className="flex items-center gap-2 rounded-lg border border-black/5 bg-white p-4 shadow-sm"
              >
                <span className="text-gold">✓</span>
                {a}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm leading-relaxed text-muted">
            お急ぎの場合も、まずはお電話ください（{siteConfig.tel}）。
            状況をうかがい、北区・板橋区から戸田斎場などを利用する場合の進め方を、わかりやすくご案内します。
          </p>
          <p className="mt-3 text-xs text-muted">
            ※ メールフォームでのお問い合わせは、今後ご用意する予定です。現在はお電話で承っています。
          </p>
        </Container>
      </section>
    </>
  );
}
