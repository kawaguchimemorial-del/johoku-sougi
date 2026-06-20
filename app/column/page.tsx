import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ColumnExplorer } from "@/components/ColumnExplorer";
import { breadcrumbLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { disclaimer } from "@/app/config/site";
import {
  columns,
  columnCategories,
  allKeywords,
} from "@/data/columns";

export const metadata: Metadata = buildMetadata({
  title: "葬儀コラム｜費用・流れ・形式・マナーをやさしく解説",
  description:
    "北区・板橋区で葬儀をご検討の方へ。葬儀の流れ・費用・一日葬や家族葬などの形式・斎場・手続き・マナーまで、知りたいテーマから探せる葬儀コラムです。運営・施行は川口典礼。",
  path: "/column/",
});

export default function ColumnIndexPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "葬儀コラム", path: "/column/" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <PageHero
        title="葬儀コラム"
        lead="「何から考えればいい？」にお答えします。費用・流れ・形式・斎場・手続き・マナーまで、知りたいテーマやキーワードから記事を探せます。"
      />

      <section className="py-10 sm:py-12">
        <Container>
          <ColumnExplorer
            columns={columns}
            categories={columnCategories}
            keywords={allKeywords()}
          />
          <p className="mt-8 text-xs leading-relaxed text-muted">
            ※ 本コラムは一般的な情報をまとめたものです。制度・手続きの詳細や最新の取り扱いは、
            各公的窓口・専門家にご確認ください。{disclaimer}
          </p>
        </Container>
      </section>

      <section className="bg-cream py-12">
        <Container className="text-center">
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            記事を読んでも迷うときは、お電話でご相談ください
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            ご事情はご家庭ごとに違います。「うちの場合はどうすれば」という個別のご相談こそ、
            お電話がいちばんの近道です。24時間365日、ご相談・お見積りは無料です。
          </p>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
