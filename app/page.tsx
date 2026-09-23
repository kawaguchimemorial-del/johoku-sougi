import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CallButton } from "@/components/CallButton";
import { CtaSection } from "@/components/CtaSection";
import { PlanCard } from "@/components/PlanCard";
import { HallCard } from "@/components/HallCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustBar } from "@/components/TrustBar";
import { VoiceList } from "@/components/VoiceList";
import { JsonLd } from "@/components/JsonLd";
import { faqLd } from "@/lib/jsonld";
import { formEnabled } from "@/lib/forms/config";
import { siteConfig, disclaimer, operatorFacts, priceNotes } from "@/app/config/site";
import { plans } from "@/data/plans";
import { areas, areaHeroLead } from "@/data/areas";
import { halls } from "@/data/halls";
import { faqs, homeFaqQuestions } from "@/data/faqs";
import { columns, getCategoryName, columnImage, columnCategories } from "@/data/columns";
import { ColumnVisual } from "@/components/ColumnVisual";

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const formHref = formEnabled ? "/contact/#contact-form" : "/contact/";

const homeFaqs = homeFaqQuestions
  .map((q) => faqs.find((f) => f.question === q))
  .filter((f): f is (typeof faqs)[number] => Boolean(f));

const reasons = [
  {
    no: "01",
    title: "斎場ごとの進め方を、最初にご案内します",
    body: "戸田斎場・舟渡斎場・北区セレモニーホール・蓮根レインボーホール・町屋斎場など、北区・板橋区・足立区の方が使いやすい斎場ごとに、空き確認・ご安置・当日の流れをご説明します。",
  },
  {
    no: "02",
    title: "総額の見通しを、区分に分けてお伝えします",
    body: "プラン料金・斎場の料金（式場・火葬）・内容で変わる費用（お礼・返礼品・飲食）を分けてお見積りします。区民葬儀との違いも、比べやすいようにご説明します。",
  },
  {
    no: "03",
    title: `創業${operatorFacts.foundedYear}年、累計${operatorFacts.cumulativeCases}の経験`,
    body: `運営・施行は${siteConfig.operator}。家族葬・一日葬・火葬式から一般葬まで、年間${operatorFacts.annualCases}のご葬儀をお手伝いしています。`,
  },
];

const flow = [
  { title: "お電話でご相談", body: "24時間365日受付。ご逝去の場合は、病院・施設名とご希望の斎場（未定でも可）をお伝えください。", time: "いつでも" },
  { title: "お迎え・ご安置", body: "病院・施設へお迎えにあがり、ご自宅または安置施設へお連れします。", time: "ご連絡後すみやかに" },
  { title: "お打合せ・お見積り", body: "形式・斎場・日程・人数をうかがい、区分ごとの総額の目安をご案内します。", time: "ご安置後" },
  { title: "ご葬儀・ご火葬", body: "戸田斎場などでお見送り。施行は川口典礼が担当し、終わったあとの手続きもご案内します。", time: "ご希望の日程で" },
];

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd(homeFaqs)} />

      {/* ===== FV：戸田斎場の実写＋信頼＋電話 ===== */}
      <section className="relative overflow-hidden bg-navy-dark text-white" data-cta-location="hero">
        <div className="absolute inset-0">
          <Image
            src="/images/hall/toda-saijo/exterior.png"
            alt="戸田斎場の外観"
            fill
            preload
            quality={55}
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/55 via-navy-dark/85 to-navy-dark md:bg-gradient-to-r md:from-navy-dark md:via-navy-dark/85 md:to-navy-dark/30" />
        </div>

        <Container className="relative pb-10 pt-12 sm:pb-14 sm:pt-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-light/50 px-3 py-1 text-xs tracking-wide text-gold-light">
              北区・板橋区・足立区の葬儀相談窓口
            </p>
            <h1 className="mt-5 font-serif text-[30px] font-bold leading-[1.45] tracking-[0.03em] sm:text-[44px] sm:leading-[1.4]">
              北区・板橋区の葬儀、
              <br />
              家族葬・一日葬・直葬の
              <br className="sm:hidden" />
              ご相談
            </h1>
            <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[13px] font-bold text-gold-light">
              <span>創業{operatorFacts.foundedYear}年</span>
              <span aria-hidden>｜</span>
              <span>累計{operatorFacts.cumulativeCases}</span>
              <span aria-hidden>｜</span>
              <span>川口典礼のGoogle口コミ★{operatorFacts.googleRating.toFixed(1)}（{operatorFacts.googleReviewCount}件）</span>
            </p>
            <p className="mt-5 text-[15px] leading-[1.95] text-white/90 sm:text-base">
              戸田斎場・舟渡斎場・北区セレモニーホールなどでのご葬儀を、
              創業{operatorFacts.foundedYear}年・累計{operatorFacts.cumulativeCases}の
              <strong className="font-bold text-gold-light">{siteConfig.operator}</strong>
              が施行します。ご逝去直後のお迎えから、まだ先の事前相談まで、24時間365日お受けしています。
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <CallButton className="w-full sm:w-auto" />
              <Link
                href={formHref}
                data-cta="hero_form"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/40 bg-white/5 px-6 text-center font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                <span>
                  費用の見積りを依頼する
                  <span className="block text-xs font-normal text-white/80">
                    {formEnabled ? "フォームで無料・1分ほど" : "ご相談の方法を見る"}
                  </span>
                </span>
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/85">
              ご相談だけで終わっても構いません。ご家族で話し合ってからのお返事で大丈夫です。
            </p>
          </div>

          <div className="mt-10">
            <TrustBar invert />
          </div>
          <p className="mt-3 text-[11px] text-white/60">
            写真：戸田斎場（外観）。当サイトは斎場の公式サイトではありません。
          </p>
        </Container>
      </section>

      {/* ===== 状況別の入口 ===== */}
      <section className="bg-cream py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="FOR YOU"
            title="いまの状況にあわせて、ご相談ください"
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl bg-navy text-white shadow-md" data-cta-location="urgent_card">
              <div className="relative aspect-[16/7]">
                <Image
                  src="/images/scene/rest-room.webp"
                  alt="ご安置のお部屋（イメージ）"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-80"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-white/80">写真はイメージです</span>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.2em] text-gold-light">URGENT</p>
                <h3 className="mt-2 font-serif text-2xl font-bold">いま、お急ぎの方</h3>
                <p className="mt-2 text-sm leading-[1.85] text-white/85">
                  病院・施設でご逝去された、または危篤のご連絡を受けた方へ。まずお電話ください。
                </p>
                <ol className="mt-5 space-y-2 text-sm">
                  {["お電話（24時間365日）", "病院・施設へお迎え", "ご自宅・安置施設へご安置", "落ち着いてからお打合せ"].map(
                    (s, i) => (
                      <li key={s} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-light/60 font-serif text-xs text-gold-light">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    )
                  )}
                </ol>
                <CallButton variant="light" showNote={false} className="mt-6 w-full" />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-sm" data-cta-location="prepare_card">
              <div className="relative aspect-[16/7]">
                <Image
                  src="/images/scene/consult-table.webp"
                  alt="事前相談のテーブル（イメージ）"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-white/90">写真はイメージです</span>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.2em] text-gold-deep">PREPARE</p>
                <h3 className="mt-2 font-serif text-2xl font-bold text-navy">まだ先のこと・事前に知りたい方</h3>
                <p className="mt-2 text-sm leading-[1.85] text-muted">
                  入院中のご家族のこと、費用の目安、斎場の選び方など。事前に知っておくだけで、いざというときの負担が軽くなります。
                </p>
                <ul className="mt-5 grid grid-cols-2 gap-2 text-sm text-navy">
                  {["費用の目安と内訳", "斎場の空き・選び方", "形式の選び方", "区民葬儀との違い"].map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span aria-hidden className="text-gold-deep">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    href={formHref}
                    data-cta="prepare_form"
                    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-navy px-5 text-center font-bold text-white transition hover:bg-navy-light"
                  >
                    見積りを依頼する（無料）
                  </Link>
                  <a
                    href="#plans"
                    className="inline-flex min-h-12 items-center justify-center rounded-lg border border-navy px-5 text-center font-bold text-navy transition hover:bg-navy/5"
                  >
                    費用の目安を見る
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== 費用の目安と総額の考え方 ===== */}
      <section id="plans" className="scroll-mt-28 py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="PRICE"
            title="費用の目安と、総額の考え方"
            lead="葬儀の費用は、大きく3つに分かれます。当社はこの3つを分けてお見積りし、総額の見通しを先にお伝えします。"
          />
          <ol className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
            {[
              ["プラン料金", "ご葬儀の施行に必要な物品・人員（下の目安。内容はお見積りで項目ごとにご確認いただけます）"],
              ["斎場の料金", "式場使用料・火葬料金（斎場や区民料金の適用で変わります）"],
              ["内容で変わる費用", "宗教者へのお礼・返礼品・飲食費など（人数・ご希望で変わります）"],
            ].map(([t, b], i, arr) => (
              <li key={t} className="contents">
                <div className="rounded-xl border border-gold/30 bg-cream p-5">
                  <p className="font-serif text-lg font-bold text-navy">{t}</p>
                  <p className="mt-1 text-sm leading-[1.8] text-muted">{b}</p>
                </div>
                {i < arr.length - 1 && (
                  <span aria-hidden className="flex items-center justify-center font-serif text-2xl text-gold-deep">
                    ＋
                  </span>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <PlanCard
                key={p.slug}
                plan={p}
                badge={p.slug === "one-day-funeral" ? "ご相談の多い形式" : undefined}
              />
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-navy/15 bg-white p-5 sm:p-6">
            <p className="font-bold text-navy">お見積りを比べるときのポイント</p>
            <p className="mt-2 text-sm leading-[1.85] text-muted">
              金額だけでなく、「式場使用料・火葬料金が含まれているか」「ご安置の日数が延びたときの費用」「返礼品・飲食の人数の見込み」を確認すると、総額の違いがわかりやすくなります。当社のお見積りも、この区分に分けてご案内します。
            </p>
          </div>
          <ul className="mt-4 space-y-1 text-xs leading-relaxed text-muted">
            {priceNotes.map((n) => (
              <li key={n}>※ {n}</li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ===== 選ばれる理由 ===== */}
      <section className="bg-navy py-14 text-white sm:py-20">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src="/images/scene/consultation.webp"
                alt="ご家族との事前相談のようす（イメージ）"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-white/85">写真はイメージです</span>
            </div>
            <div>
              <SectionHeading eyebrow="REASON" title="城北セレモニーサポートセンターの考え方" invert />
              <ol className="mt-8 space-y-7">
                {reasons.map((r) => (
                  <li key={r.no} className="grid grid-cols-[auto_1fr] gap-4">
                    <span className="font-serif text-3xl font-bold leading-none text-gold-light">{r.no}</span>
                    <div>
                      <h3 className="font-serif text-lg font-bold leading-snug">{r.title}</h3>
                      <p className="mt-2 text-sm leading-[1.9] text-white/80">{r.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== お客様の声 ===== */}
      <section className="bg-cream py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="VOICE"
            title="ご葬儀を終えたご家族の声"
            lead="川口典礼でご葬儀をされたご家族に、ご葬儀後のアンケートでいただいた声です（原文から抜粋）。"
          />
          <div className="mt-8">
            <VoiceList />
          </div>
          <a
            href={operatorFacts.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-navy underline underline-offset-4"
          >
            Googleの口コミ（★{operatorFacts.googleRating.toFixed(1)}・{operatorFacts.googleReviewCount}件）を見る
            <span aria-hidden>↗</span>
          </a>
        </Container>
      </section>

      {/* ===== 流れ ===== */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="FLOW" title="ご相談から葬儀までの流れ" />
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {flow.map((f, i) => (
              <li key={f.title} className="relative rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                <span className="font-serif text-4xl font-bold text-gold/50">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-serif text-lg font-bold text-navy">{f.title}</h3>
                <p className="mt-1 text-xs font-bold text-gold-deep">{f.time}</p>
                <p className="mt-2 text-sm leading-[1.85] text-muted">{f.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ===== 対応斎場 ===== */}
      <section className="bg-cream py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="HALL"
            title="北区・板橋区・足立区から使いやすい斎場"
            lead="斎場の空き確認だけのご相談も承ります。各斎場の所在地・アクセス・特徴は斎場ページでご確認いただけます。"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {halls.map((h) => (
              <HallCard key={h.slug} hall={h} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">※ 当サイトは各斎場の公式施設サイトではありません。運営・施行は川口典礼です。</p>
        </Container>
      </section>

      {/* ===== 対応エリア ===== */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="AREA" title="対応エリア" />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={a.href}
                className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:border-gold/40 hover:shadow-md"
              >
                <h3 className="font-serif text-lg font-bold text-navy">{a.name}の葬儀・葬式のご相談</h3>
                <p className="mt-2 text-sm leading-[1.85] text-muted">{areaHeroLead(a)}</p>
                <span className="mt-3 inline-block text-sm font-bold text-navy group-hover:underline">
                  {a.name}の斎場・費用・手続きを見る →
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">{operatorFacts.visitNote}</p>
        </Container>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-cream py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="FAQ" title="はじめての方によくあるご質問" />
          <div className="mt-8 divide-y divide-black/10 rounded-2xl border border-black/5 bg-white">
            {homeFaqs.map((f) => (
              <details key={f.question} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-bold text-navy">
                  <span>
                    <span className="mr-2 font-serif text-gold-deep">Q.</span>
                    {f.question}
                  </span>
                  <span aria-hidden className="mt-0.5 text-gold-deep transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm leading-[1.9] text-ink/85">{f.answer}</p>
              </details>
            ))}
          </div>
          <Link href="/faq/" className="mt-5 inline-flex min-h-11 items-center text-sm font-bold text-navy underline underline-offset-4">
            よくある質問をすべて見る →
          </Link>
        </Container>
      </section>

      {/* ===== コラム ===== */}
      <section className="py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="COLUMN"
            title="葬儀の「知りたい」がわかるコラム"
            lead="費用・流れ・形式・手続き・マナーまで、はじめての方がつまずきやすい点をやさしく解説しています。"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {columns.slice(0, 3).map((c) => {
              const illust =
                columnCategories.find((cat) => cat.slug === c.category)?.illust ?? "flow";
              return (
                <Link
                  key={c.slug}
                  href={`/column/${c.slug}/`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative h-36 w-full">
                    <ColumnVisual
                      src={columnImage(c)}
                      illust={illust}
                      alt={c.title}
                      className="h-full w-full"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-navy/90 px-3 py-1 text-[11px] font-bold text-white">
                      {getCategoryName(c.category)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-bold leading-snug text-navy group-hover:underline">{c.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href="/column/" className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-navy underline underline-offset-4">
            コラムをすべて見る →
          </Link>
        </Container>
      </section>

      {/* ===== 運営会社 ===== */}
      <section className="border-t border-black/5 bg-cream py-14 sm:py-16">
        <Container>
          <SectionHeading eyebrow="COMPANY" title={`運営・施行：${siteConfig.operator}`} />
          <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[140px_1fr]">
            <dt className="font-bold text-navy">会社名</dt>
            <dd>{operatorFacts.legalName}（創業{operatorFacts.foundedYear}年）</dd>
            <dt className="font-bold text-navy">所在地</dt>
            <dd>
              〒{operatorFacts.postal} {operatorFacts.address}（自社式場：{operatorFacts.hallName}）
            </dd>
            <dt className="font-bold text-navy">北区・板橋区・足立区</dt>
            <dd>{operatorFacts.visitNote}</dd>
            <dt className="font-bold text-navy">お電話</dt>
            <dd>
              <a href={siteConfig.telLink} className="font-bold text-navy underline">
                {siteConfig.tel}
              </a>
              （{siteConfig.telNote}）
            </dd>
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-muted">{disclaimer}</p>
          <Link href="/company/" className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-navy underline underline-offset-4">
            運営者情報を見る →
          </Link>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
