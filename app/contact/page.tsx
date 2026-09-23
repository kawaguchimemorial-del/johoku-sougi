import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { CallButton } from "@/components/CallButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustBar } from "@/components/TrustBar";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { formEnabled } from "@/lib/forms/config";
import { siteConfig, operatorFacts } from "@/app/config/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "ご相談・お見積り（無料）｜電話・フォーム",
  description:
    "城北セレモニーサポートセンター（運営・施行：川口典礼）へのご相談・お見積りの窓口です。お電話は24時間365日受付。フォームからは費用の目安や斎場の空き確認のご相談を承ります。病院・施設からのお迎えはお電話でご連絡ください。",
  path: "/contact/",
});

const promises = [
  {
    title: "ご相談・お見積りは無料です",
    body: "ご相談だけで終わっても費用はかかりません。比較のための見積り依頼も承ります。",
  },
  {
    title: "費用は区分ごとにご説明します",
    body: "プラン料金・式場や火葬の料金・変動する費用（お礼・返礼品・飲食）に分けて、総額の見通しをお伝えします。",
  },
  {
    title: "ほかの葬儀社と比べてからでも大丈夫です",
    body: "お見積りを比べたい、というご相談も承ります。ご家族で話し合ってからのお返事で構いません。",
  },
];

export default function ContactPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "ご相談・お見積り", path: "/contact/" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      {/* ヒーロー：電話を最優先 */}
      <section className="bg-navy text-white" data-cta-location="contact_hero">
        <Container className="grid items-center gap-8 py-10 md:grid-cols-[1.15fr_1fr] md:py-14">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-gold-light">CONTACT</p>
            <h1 className="mt-3 font-serif text-[28px] font-bold leading-[1.45] sm:text-4xl">
              ご相談・お見積り（無料）
            </h1>
            <p className="mt-4 text-[15px] leading-[1.9] text-white/85">
              お急ぎの方・病院や施設からのお迎えは、お電話がいちばん早く確実です。
              24時間365日、相談員が直接お受けします。
            </p>
            <div className="mt-6">
              <CallButton variant="light" className="w-full sm:w-auto" />
            </div>
            {formEnabled && (
              <a
                href="#contact-form"
                data-cta="contact_to_form"
                className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-gold-light underline underline-offset-4"
              >
                まだ先のこと・費用だけ知りたい方はフォームへ ↓
              </a>
            )}
          </div>
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-xl md:block">
            <Image
              src="/images/scene/consultation.webp"
              alt="ご相談のようす（イメージ）"
              fill
              sizes="(max-width: 768px) 0px, 40vw"
              className="object-cover"
            />
            <span className="absolute bottom-2 right-3 text-[11px] text-white/80">写真はイメージです</span>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <ul className="grid gap-4 sm:grid-cols-3">
            {promises.map((p) => (
              <li key={p.title} className="rounded-xl border border-gold/25 bg-cream p-5">
                <p className="font-serif text-[17px] font-bold leading-snug text-navy">{p.title}</p>
                <p className="mt-2 text-sm leading-[1.85] text-muted">{p.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <SectionHeading
              eyebrow="FORM"
              title={formEnabled ? "フォームでのご相談" : "お電話でのご相談"}
              lead={
                formEnabled
                  ? "必須項目は「ご相談の内容・お名前・連絡先・連絡方法」だけです。わかる範囲でご記入ください。内容を確認のうえ、担当者よりご連絡します。"
                  : `現在、ご相談はお電話（${siteConfig.tel}・24時間365日）で承っています。`
              }
            />
            <div className="mt-6 max-w-3xl">
              {formEnabled ? (
                <ContactForm />
              ) : (
                <div className="rounded-xl border border-black/5 bg-cream p-8 text-center" data-cta-location="contact_body">
                  <CallButton />
                </div>
              )}
            </div>
          </div>

          <div className="mt-14 max-w-3xl">
            <SectionHeading eyebrow="AFTER" title="ご相談のあとの流れ" as="h2" />
            <ol className="mt-6 space-y-5 border-l border-gold/40 pl-6">
              {[
                ["状況をうかがいます", "ご逝去の有無、ご希望の形式・斎場、ご参列の人数などをうかがいます。"],
                ["お見積りをご案内します", "プラン料金・斎場の料金・変動する費用を分けて、総額の目安をお伝えします。"],
                ["ご納得いただいてからご依頼", "ご家族で相談してからのお返事で構いません。"],
              ].map(([t, b], i) => (
                <li key={t} className="relative">
                  <span className="absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full bg-navy font-serif text-xs text-white">
                    {i + 1}
                  </span>
                  <p className="font-bold text-navy">{t}</p>
                  <p className="mt-1 text-sm leading-[1.85] text-muted">{b}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 max-w-3xl">
            <TrustBar />
            <p className="mt-6 text-sm leading-[1.85] text-muted">
              運営・施行：{siteConfig.operator}（{operatorFacts.address}）。{operatorFacts.visitNote}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
