import { Container } from "./Container";
import { PageCta } from "./PageCta";
import { operatorFacts, siteConfig } from "@/app/config/site";

// 下層ページ共通の見出しヒーロー。トップと同じ明朝見出し・実績の一行・相談CTAを持つ。
export function PageHero({
  title,
  lead,
  cta = false,
  ctaQuery,
  ctaLocation = "page_hero",
  formLabel,
}: {
  title: string;
  lead?: string;
  // 相談CTA（電話・フォーム）を表示するか。プラン・エリア・斎場ページで使う
  cta?: boolean;
  ctaQuery?: string;
  ctaLocation?: string;
  formLabel?: string;
}) {
  return (
    <section className="bg-gradient-to-b from-navy-dark to-navy py-12 text-white sm:py-16">
      <Container>
        <span aria-hidden className="inline-block h-px w-10 bg-gold-light" />
        <h1 className="mt-4 font-serif text-[27px] font-bold leading-[1.45] tracking-[0.02em] sm:text-4xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.9] text-white/85">{lead}</p>
        )}
        {cta && (
          <>
            <p className="mt-5 text-[13px] font-bold text-gold-light">
              運営・施行：{siteConfig.operator}｜創業{operatorFacts.foundedYear}年・累計
              {operatorFacts.cumulativeCases}・Google口コミ★{operatorFacts.googleRating.toFixed(1)}
            </p>
            <PageCta
              location={ctaLocation}
              query={ctaQuery}
              formLabel={formLabel}
              invert
              className="mt-5"
            />
          </>
        )}
      </Container>
    </section>
  );
}
