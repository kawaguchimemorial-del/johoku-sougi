import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlanCard } from "@/components/PlanCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, faqLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { disclaimer } from "@/app/config/site";
import { halls, getHall } from "@/data/halls";
import { plans } from "@/data/plans";

export function generateStaticParams() {
  return halls.map((h) => ({ hall: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hall: string }>;
}): Promise<Metadata> {
  const { hall: slug } = await params;
  const hall = getHall(slug);
  if (!hall) return {};
  return buildMetadata({
    title: `${hall.name}での葬儀｜一日葬・火葬式・直葬・家族葬の相談`,
    description: `${hall.name}での葬儀をご検討の方へ。${hall.summary}一日葬・火葬式・直葬・家族葬のご相談、空き状況の確認を、城北セレモニーサポートセンター（運営・施行：川口典礼）が承ります。`,
    path: hall.href,
    image: hall.image,
  });
}

// 斎場利用時の共通の流れ（搬送・安置・空き確認を含む）
const flow = [
  {
    title: "お電話でご相談",
    body: "「◯◯（斎場名）で考えている」とお伝えください。24時間365日受け付けています。",
  },
  {
    title: "病院・施設からの搬送",
    body: "病院や施設からのお迎え（搬送）に対応します。どこへ搬送すればよいか分からない場合もご相談ください。",
  },
  {
    title: "安置先のご相談",
    body: "ご自宅または安置施設など、ご事情に合わせて安置先をご相談いただけます。",
  },
  {
    title: "空き状況の確認・お見積り",
    body: "ご希望の日程・形式をうかがい、斎場の空き状況と総額の目安をご案内します。",
  },
  {
    title: "ご葬儀の施行",
    body: "当該斎場でお見送り。施行は川口典礼が担当します。",
  },
];

export default async function HallPage({
  params,
}: {
  params: Promise<{ hall: string }>;
}) {
  const { hall: slug } = await params;
  const hall = getHall(slug);
  if (!hall) notFound();

  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "斎場一覧", path: "/hall/" },
    { name: hall.name, path: hall.href },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), faqLd(hall.faqs)]} />
      <Breadcrumbs items={crumbs} />
      <PageHero title={`${hall.name}での葬儀`} lead={hall.lead} />

      {/* リード本文 */}
      <section className="py-12">
        <Container>
          {/* 斎場のカバー画像（スマホで大きくなりすぎないよう高さを抑える） */}
          <figure className="overflow-hidden rounded-xl border border-black/5 shadow-sm">
            <div className="relative aspect-[16/9] max-h-[420px] w-full bg-cream">
              <Image
                src={hall.image}
                alt={hall.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
              />
            </div>
            <figcaption className="bg-cream px-4 py-2 text-xs text-muted">
              写真は斎場のイメージです。
            </figcaption>
          </figure>

          <p className="mt-6 text-xs text-muted">{hall.area}</p>
          {hall.intro.map((p) => (
            <p key={p} className="mt-4 leading-relaxed">
              {p}
            </p>
          ))}
          <ul className="mt-6 space-y-2">
            {hall.points.map((pt) => (
              <li key={pt} className="flex gap-2">
                <span className="text-gold">✓</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 相談が多い形式 */}
      <section className="bg-cream py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            {hall.name}でご相談が多い葬儀形式
          </h2>
          <p className="mt-3 leading-relaxed text-muted">{hall.popularNote}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {plans.map((p) => (
              <PlanCard key={p.slug} plan={p} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            ※ 表示価格は目安です。内容により費用が変わる場合があります。正確な費用は個別にお見積りします。
          </p>
        </Container>
      </section>

      {/* 利用時の流れ */}
      <section className="py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            {hall.name}を利用する場合の流れ
          </h2>
          <ol className="mt-6 space-y-3">
            {flow.map((f, i) => (
              <li
                key={f.title}
                className="flex gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <span className="font-bold text-gold">{i + 1}</span>
                <div>
                  <p className="font-bold text-navy">{f.title}</p>
                  <p className="text-sm text-muted">{f.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 費用の考え方 */}
      <section className="bg-cream py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">費用の考え方</h2>
          <p className="mt-3 leading-relaxed">{hall.costNote}</p>
          <ul className="mt-4 space-y-1 rounded-md bg-white p-4 text-xs leading-relaxed text-muted">
            <li>※ 表示価格は目安です。内容により費用が変わる場合があります。</li>
            <li>
              ※ 式場料金・火葬料金・宗教者へのお礼・返礼品・飲食費などは内容により変動します。
            </li>
            <li>※ 正確な費用は個別にお見積りします。詳しくはお問い合わせください。</li>
          </ul>
        </Container>
      </section>

      {/* 斎場固有FAQ */}
      <section className="py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            {hall.name}についてよくある質問
          </h2>
          <dl className="mt-6 space-y-4">
            {hall.faqs.map((f) => (
              <div
                key={f.question}
                className="rounded-xl border border-black/5 bg-white p-5 shadow-sm"
              >
                <dt className="font-bold text-navy">Q. {f.question}</dt>
                <dd className="mt-1 text-sm text-muted">A. {f.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 rounded-md bg-cream p-4 text-sm leading-relaxed text-muted">
            {disclaimer}
          </p>
        </Container>
      </section>

      {/* 関連リンク */}
      <section className="bg-cream py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">関連ページ</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/area/kita-ku/"
              className="rounded-lg border border-black/5 bg-white p-4 font-bold text-navy shadow-sm hover:border-gold/40"
            >
              北区で葬儀をお考えの方 →
            </Link>
            <Link
              href="/area/itabashi-ku/"
              className="rounded-lg border border-black/5 bg-white p-4 font-bold text-navy shadow-sm hover:border-gold/40"
            >
              板橋区で葬儀をお考えの方 →
            </Link>
            <Link
              href="/hall/"
              className="rounded-lg border border-black/5 bg-white p-4 font-bold text-navy shadow-sm hover:border-gold/40"
            >
              対応斎場一覧を見る →
            </Link>
            <Link
              href="/contact/"
              className="rounded-lg border border-black/5 bg-white p-4 font-bold text-navy shadow-sm hover:border-gold/40"
            >
              ご相談・お見積りについて →
            </Link>
          </div>
        </Container>
      </section>

      <CtaSection heading={`${hall.name}の空き確認・ご相談はお電話で`} />
    </>
  );
}
