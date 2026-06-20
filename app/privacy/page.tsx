import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/app/config/site";

export const metadata: Metadata = buildMetadata({
  title: "プライバシーポリシー",
  description:
    "城北セレモニーサポートセンター（運営・施行：川口典礼）のプライバシーポリシーです。お客様の個人情報の取り扱いについてご案内します。",
  path: "/privacy/",
});

const sections = [
  {
    h: "1. 個人情報の取得について",
    p: "当サイトでは、お電話によるご相談・お見積りの際に、お名前、ご連絡先、ご葬儀に関するご希望など、ご相談に必要な範囲で個人情報をお伺いする場合があります。",
  },
  {
    h: "2. 個人情報の利用目的",
    p: "お伺いした個人情報は、ご相談への対応、お見積りのご案内、ご葬儀の施行、関連するご連絡のために利用します。これらの目的の範囲を超えて利用することはありません。",
  },
  {
    h: "3. 個人情報の第三者提供",
    p: "法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。ただし、ご葬儀の施行に必要な範囲で、業務委託先（斎場・関連事業者等）に必要な情報を提供する場合があります。",
  },
  {
    h: "4. 個人情報の管理",
    p: "お預かりした個人情報は、漏えい・滅失・毀損の防止に努め、適切に管理します。",
  },
  {
    h: "5. お問い合わせ",
    p: `個人情報の取り扱いに関するお問い合わせは、お電話（${siteConfig.tel}）にて承ります。`,
  },
  {
    h: "6. 本ポリシーの変更",
    p: "本プライバシーポリシーの内容は、法令の変更等に応じて予告なく変更する場合があります。",
  },
];

export default function PrivacyPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "プライバシーポリシー", path: "/privacy/" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHero title="プライバシーポリシー" />

      <section className="py-12">
        <Container>
          <p className="leading-relaxed text-muted">
            城北セレモニーサポートセンター（運営・施行：{siteConfig.operator}）は、
            お客様の個人情報を適切に取り扱うため、以下のとおりプライバシーポリシーを定めます。
          </p>
          <div className="mt-8 space-y-6">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="font-bold text-navy">{s.h}</h2>
                <p className="mt-1 leading-relaxed text-muted">{s.p}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
