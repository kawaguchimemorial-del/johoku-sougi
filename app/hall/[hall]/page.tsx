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
import { areas } from "@/data/areas";
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
    ...(hall.image ? { image: hall.image } : {}),
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

  // 関連エリアリンク（斎場ごとに指定。未指定なら北区・板橋区）
  const relatedAreaSlugs = hall.relatedAreas ?? ["kita-ku", "itabashi-ku"];
  const relatedAreas = relatedAreaSlugs
    .map((slug) => areas.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

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
          {hall.image && (
            <figure className="overflow-hidden rounded-xl border border-black/5 shadow-sm">
              <div className="relative aspect-[16/9] max-h-[420px] w-full bg-cream">
                <Image
                  src={hall.image}
                  alt={hall.imageAlt ?? `${hall.name}の外観・施設イメージ`}
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
          )}

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

      {/* 所在地・アクセス・施設（データがある斎場のみ） */}
      {(hall.address || (hall.access && hall.access.length > 0)) && (
        <section className="bg-cream py-12">
          <Container>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              {hall.name}の所在地・アクセス
            </h2>
            {hall.address && (
              <p className="mt-4 leading-relaxed">所在地：{hall.address}</p>
            )}
            {hall.access && hall.access.length > 0 && (
              <ul className="mt-4 space-y-2">
                {hall.access.map((a) => (
                  <li key={a} className="flex gap-2 text-sm">
                    <span className="text-gold">・</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            )}
            {hall.parking && (
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {hall.parking}
              </p>
            )}
            {hall.facilities && hall.facilities.length > 0 && (
              <>
                <h3 className="mt-8 text-lg font-bold text-navy">施設の構成</h3>
                <ul className="mt-3 space-y-2">
                  {hall.facilities.map((f) => (
                    <li key={f} className="flex gap-2 text-sm">
                      <span className="text-gold">・</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="mt-6 rounded-md bg-white p-4 text-xs leading-relaxed text-muted">
              施設の情報は変更される場合があります。最新の内容はお電話でご確認ください。
              {disclaimer}
            </p>
          </Container>
        </section>
      )}

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

      {/* 祭壇イメージ（画像を用意している斎場のみ） */}
      {hall.altar && (
      <section className="py-12">
        <Container>
          <h2 className="text-xl font-bold text-navy sm:text-2xl">
            {hall.name}での祭壇イメージ
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            ご葬儀を施行する際の祭壇の一例です。式の内容やご要望により設えは異なります。
          </p>
          <figure className="mt-6 overflow-hidden rounded-xl border border-black/5 shadow-sm">
            <div className="relative aspect-[16/9] max-h-[420px] w-full bg-cream">
              <Image
                src={hall.altar}
                alt={hall.altarAlt ?? `${hall.name}での祭壇イメージ`}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
              />
            </div>
            <figcaption className="bg-cream px-4 py-2 text-xs text-muted">
              祭壇の一例です。写真はイメージを含みます。
            </figcaption>
          </figure>
        </Container>
      </section>
      )}

      {/* 画像ギャラリー（戸田斎場など gallery を持つ斎場のみ） */}
      {hall.gallery && hall.gallery.length > 0 && (
        <section className="bg-cream py-12">
          <Container>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              {hall.name}の館内・設備の様子
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              外観から式場、火葬場併設の設備、待合・控室まで、ご利用時のイメージをご紹介します。
              写真はイメージを含み、ご利用区分やご要望により設えは異なります。
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hall.gallery.map((g) => (
                <figure
                  key={g.src}
                  className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm"
                >
                  <div className="relative aspect-[4/3] w-full bg-cream">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="px-4 py-2 text-xs text-muted">
                    {g.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* どのような方が検討しやすいか（任意・戸田斎場） */}
      {hall.whoFor && hall.whoFor.length > 0 && (
        <section className="py-12">
          <Container>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              {hall.name}を検討しやすい方
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {hall.whoFor.map((w) => (
                <li
                  key={w}
                  className="flex gap-2 rounded-lg border border-black/5 bg-white p-4 shadow-sm"
                >
                  <span className="text-gold">●</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

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

      {/* 施設料金の目安（公表料金がある斎場のみ） */}
      {hall.fees && hall.fees.length > 0 && (
        <section className="py-12">
          <Container>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              {hall.name}の施設料金の目安
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              {hall.name}をご利用の際にかかる、施設側の料金の目安です（税込）。
              このほかにご葬儀プランの費用がかかります。
            </p>
            <div className="mt-6 space-y-6">
              {hall.fees.map((table) => (
                <div
                  key={table.heading}
                  className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm"
                >
                  <h3 className="bg-cream px-5 py-3 font-bold text-navy">
                    {table.heading}
                  </h3>
                  <dl className="divide-y divide-black/5">
                    {table.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-baseline sm:justify-between"
                      >
                        <dt className="text-sm font-medium text-navy">
                          {row.label}
                        </dt>
                        <dd className="text-sm">
                          {row.price}
                          {row.note && (
                            <span className="ml-2 text-xs text-muted">
                              {row.note}
                            </span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {table.note && (
                    <p className="px-5 py-3 text-xs text-muted">※ {table.note}</p>
                  )}
                </div>
              ))}
            </div>
            <ul className="mt-6 space-y-1 rounded-md bg-cream p-4 text-xs leading-relaxed text-muted">
              <li>※ 金額はすべて税込の目安です。内容や利用区分により変動します。</li>
              <li>
                ※ 上記は施設側の料金です。ご葬儀プランの費用、宗教者へのお礼・返礼品・飲食費などは別途かかり、内容により変動します。
              </li>
              <li>※ 正確な費用は個別にお見積りします。詳しくはお問い合わせください。</li>
              {hall.feeSource && (
                <li>
                  ※ 施設料金は{hall.feeSource.checked}時点で
                  <a
                    href={hall.feeSource.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline hover:text-navy"
                  >
                    {hall.feeSource.label}
                  </a>
                  に公表されていた内容をもとにしています。最新の料金は施設の公表内容をご確認ください。
                </li>
              )}
            </ul>
          </Container>
        </section>
      )}

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
            {relatedAreas.map((a) => (
              <Link
                key={a.slug}
                href={a.href}
                className="rounded-lg border border-black/5 bg-white p-4 font-bold text-navy shadow-sm hover:border-gold/40"
              >
                {a.name}で葬儀をお考えの方 →
              </Link>
            ))}
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

      {/* まず電話で伝えるとよいこと（任意・戸田斎場） */}
      {hall.firstCall && hall.firstCall.length > 0 && (
        <section className="py-12">
          <Container>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">
              まずお電話で、これだけお伝えください
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              はじめてのご相談でも大丈夫です。一日葬・火葬式・家族葬の違いも含めてご案内します。
            </p>
            <ol className="mt-6 space-y-3">
              {hall.firstCall.map((f, i) => (
                <li
                  key={f}
                  className="flex gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-sm"
                >
                  <span className="font-bold text-gold">{i + 1}</span>
                  <span>{f}</span>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      <CtaSection heading={`${hall.name}の空き確認・ご相談はお電話で`} />
    </>
  );
}
