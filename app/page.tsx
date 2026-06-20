import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CallButton } from "@/components/CallButton";
import { CtaSection } from "@/components/CtaSection";
import { PriceNote } from "@/components/PriceNote";
import { PlanCard } from "@/components/PlanCard";
import { HallCard } from "@/components/HallCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/jsonld";
import { siteConfig, ctaText, disclaimer } from "@/app/config/site";
import { plans, formatPrice } from "@/data/plans";
import { halls } from "@/data/halls";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const worries = [
  "戸田斎場で葬儀を考えているが、進め方がわからない",
  "北区・板橋区で、どの斎場を選べばよいか迷っている",
  "一日葬や火葬式・直葬で、費用を抑えたい",
  "病院・施設から、すぐにお迎えに来てほしい",
  "まずは斎場の空き状況や、おおよその費用を知りたい",
];

const flow = [
  { step: "01", title: "お電話でご相談", body: "24時間365日受付。「戸田斎場で考えている」とお伝えください。" },
  { step: "02", title: "お迎え・ご安置", body: "病院・施設へお迎えにあがり、安置先のご相談にも対応します。" },
  { step: "03", title: "プラン・お見積り", body: "ご希望をうかがい、形式・斎場・費用を個別にご案内します。" },
  { step: "04", title: "ご葬儀の施行", body: "戸田斎場などでお見送り。施行は川口典礼が担当します。" },
];

export default function Home() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "ホーム", path: "/" }])} />

      {/* FV */}
      <section className="bg-gradient-to-b from-navy-dark to-navy-light text-white">
        <Container className="py-16 sm:py-20">
          <span className="inline-block rounded border border-gold/60 px-3 py-1 text-xs tracking-wide text-gold-light">
            北区・板橋区の葬儀相談窓口
          </span>
          <h1 className="mt-5 text-2xl font-bold leading-relaxed sm:text-4xl">
            戸田斎場での一日葬・ご火葬を、
            <br className="hidden sm:block" />
            迷わず進めるために。
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-white/85">
            火葬場併設の戸田斎場は、北区・板橋区から多くの方に利用されています。
            城北セレモニーサポートセンターは、戸田斎場での一日葬・火葬式・直葬・家族葬のご相談を、
            わかりやすくサポートする相談窓口です。
          </p>
          <p className="mt-4 text-sm text-gold-light">
            運営・施行：{siteConfig.operator}
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <CallButton />
            <Link
              href="/contact/"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-7 py-4 font-bold text-white transition hover:bg-white/10"
            >
              ご相談・お見積りについて
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/80">{ctaText.primary}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {["斎場の空き確認", "病院・施設からの搬送", "安置先のご相談", "お見積り"].map(
              (c) => (
                <li
                  key={c}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/90"
                >
                  {c}
                </li>
              )
            )}
          </ul>
        </Container>
      </section>

      {/* 訴求バー */}
      <section className="bg-cream py-6">
        <Container>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-navy">
            {ctaText.appeals.map((a) => (
              <li key={a} className="flex items-center gap-1.5">
                <span className="text-gold">✓</span>
                {a}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* こんなお悩み */}
      <section className="py-14">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            こんなお悩みはありませんか
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {worries.map((w) => (
              <li
                key={w}
                className="rounded-lg border border-black/5 bg-white p-4 shadow-sm"
              >
                <span className="mr-2 text-gold">●</span>
                {w}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-muted">
            ひとつでも当てはまる場合は、まずお電話ください。状況をうかがい、北区・板橋区から戸田斎場を利用する場合の進め方を、わかりやすくご案内します。
          </p>
        </Container>
      </section>

      {/* 一番相談が多いプラン：一日葬 */}
      <section className="bg-cream py-14">
        <Container>
          <p className="text-sm font-bold text-gold">一番ご相談が多いプラン</p>
          <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">
            戸田斎場での一日葬
          </h2>
          <div className="mt-6 rounded-xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="leading-relaxed">
              通夜を行わず、一日でお見送りする形式です。5〜30名程度のご相談が多く、
              ご親族中心で負担を抑えながらお別れの時間を持ちたい方に選ばれています。
            </p>
            <p className="mt-4 text-2xl font-bold text-navy">
              目安 {formatPrice(496000)}
            </p>
            <PriceNote />
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/plan/one-day-funeral/"
                className="rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                一日葬の詳細を見る
              </Link>
              <Link
                href="/hall/toda-saijo/"
                className="rounded-lg border border-navy px-5 py-3 text-sm font-bold text-navy hover:bg-navy/5"
              >
                戸田斎場について
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* プラン一覧 */}
      <section className="py-14">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            ご葬儀の形式から相談する
          </h2>
          <p className="mt-2 text-sm text-muted">
            一日葬・火葬式・直葬・家族葬を、向いている方やまず確認することとあわせて比較できます。
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {plans.map((p) => (
              <PlanCard key={p.slug} plan={p} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            ※ 表示価格は目安です。内容により費用が変わる場合があります。式場料金・火葬料金・宗教者へのお礼・返礼品・飲食費などは内容により変動します。正確な費用は個別にお見積りします。
          </p>
        </Container>
      </section>

      {/* 対応斎場 */}
      <section className="bg-cream py-14">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">対応斎場</h2>
          <p className="mt-2 text-sm text-muted">
            北区・板橋区から利用しやすい式場を、状況に合わせてご案内します。空き確認だけのご相談も承ります。
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {halls.map((h) => (
              <HallCard key={h.slug} hall={h} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            ※ 当サイトは各斎場の公式施設サイトではありません。運営・施行は川口典礼です。
          </p>
        </Container>
      </section>

      {/* エリア */}
      <section className="py-14">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">対応エリア</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Link
              href="/area/kita-ku/"
              className="rounded-xl border border-black/5 bg-white p-6 shadow-sm transition hover:border-gold/40 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-navy">
                北区で葬儀をお考えの方
              </h3>
              <p className="mt-2 text-sm text-muted">
                北区から戸田斎場を利用する場合の考え方や、各プランへの導線をご案内します。
              </p>
            </Link>
            <Link
              href="/area/itabashi-ku/"
              className="rounded-xl border border-black/5 bg-white p-6 shadow-sm transition hover:border-gold/40 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-navy">
                板橋区で葬儀をお考えの方
              </h3>
              <p className="mt-2 text-sm text-muted">
                板橋区から戸田斎場を利用する場合の考え方や、各プランへの導線をご案内します。
              </p>
            </Link>
          </div>
        </Container>
      </section>

      {/* 流れ */}
      <section className="bg-cream py-14">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            ご相談から葬儀までの流れ
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-4">
            {flow.map((f) => (
              <li
                key={f.step}
                className="rounded-xl border border-black/5 bg-white p-5 shadow-sm"
              >
                <span className="text-2xl font-bold text-gold">{f.step}</span>
                <h3 className="mt-1 font-bold text-navy">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ抜粋 */}
      <section className="py-14">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            よくある質問
          </h2>
          <dl className="mt-6 divide-y divide-black/5">
            {faqs.slice(0, 5).map((f) => (
              <div key={f.question} className="py-4">
                <dt className="font-bold text-navy">Q. {f.question}</dt>
                <dd className="mt-1 text-sm text-muted">A. {f.answer}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/faq/"
            className="mt-4 inline-block text-sm font-bold text-gold hover:underline"
          >
            よくある質問をすべて見る →
          </Link>
        </Container>
      </section>

      {/* 運営・施行 */}
      <section className="bg-cream py-14">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            運営・施行：{siteConfig.operator}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">{disclaimer}</p>
          <p className="mt-4">
            <Link
              href="/company/"
              className="text-sm font-bold text-gold hover:underline"
            >
              運営者情報を見る →
            </Link>
          </p>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
