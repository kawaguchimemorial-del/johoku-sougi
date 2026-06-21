import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, disclaimer } from "@/app/config/site";
import { publishedReviewers } from "@/data/reviewers";

export const metadata: Metadata = buildMetadata({
  title: "運営者情報",
  description:
    "城北セレモニーサポートセンターの運営者情報です。運営・施行は川口典礼。対応エリアは東京都北区・板橋区および周辺地域。一日葬・火葬式・直葬・家族葬、斎場相談、搬送、安置相談、見積り相談に対応します。",
  path: "/company/",
});

export default function CompanyPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "運営者情報", path: "/company/" },
  ];

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "サイト名", value: siteConfig.name },
    { label: "運営・施行", value: siteConfig.operator },
    { label: "対応エリア", value: siteConfig.areas.join("・") },
    {
      label: "主な対応",
      value:
        "一日葬、火葬式・直葬、家族葬、斎場相談、搬送、安置相談、お見積り相談",
    },
    {
      label: "電話番号",
      value: (
        <a
          href={siteConfig.telLink}
          className="font-bold text-navy hover:underline"
        >
          {siteConfig.tel}（{siteConfig.telNote}）
        </a>
      ),
    },
    {
      label: "公式サイト",
      value: (
        <a
          href={siteConfig.parentSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy underline hover:text-gold"
        >
          {siteConfig.parentSiteName}
        </a>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHero title="運営者情報" />

      <section className="py-12">
        <Container>
          <dl className="overflow-hidden rounded-xl border border-black/5 shadow-sm">
            {rows.map((r, i) => (
              <div
                key={r.label}
                className={`grid grid-cols-1 gap-1 p-5 sm:grid-cols-[160px_1fr] ${
                  i % 2 === 0 ? "bg-white" : "bg-cream"
                }`}
              >
                <dt className="font-bold text-navy">{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>

          {publishedReviewers().length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                コラムの監修者
              </h2>
              <p className="mt-2 text-sm text-muted">
                葬儀分野のコラムは、次の監修者が内容を確認しています。
              </p>
              <div className="mt-5 space-y-4">
                {publishedReviewers().map((rv) => (
                  <div
                    key={rv.id}
                    id={`reviewer-${rv.id}`}
                    className="rounded-xl border border-black/5 bg-white p-6 shadow-sm"
                  >
                    <p className="font-bold text-navy">
                      {rv.name}
                      <span className="ml-2 text-sm font-normal text-muted">
                        {rv.title}（{rv.role}）
                      </span>
                    </p>
                    {rv.credentials.length > 0 && (
                      <p className="mt-1 text-sm text-gold">
                        {rv.credentials.join("・")}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed">{rv.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-xl bg-cream p-6 text-sm leading-relaxed text-muted">
            <p>{disclaimer}</p>
            <p className="mt-3">
              本サイトは、北区・板橋区の方が戸田斎場をはじめとする斎場を利用してご葬儀を行う際の相談窓口として、川口典礼が運営しています。
              北区・板橋区に実店舗・営業所があることを示すものではありません。
            </p>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
