import { operatorFacts, siteConfig } from "@/app/config/site";

// 運営会社（川口典礼）の実績。数値は site.ts の確定事実のみ。主語が川口典礼全体であることを必ず添える。
export function TrustBar({ invert = false }: { invert?: boolean }) {
  const items = [
    { value: `${operatorFacts.foundedYear}年`, label: "創業" },
    { value: operatorFacts.cumulativeCases, label: "累計のご葬儀" },
    { value: operatorFacts.annualCases, label: "年間のご葬儀" },
    {
      value: `★${operatorFacts.googleRating.toFixed(1)}`,
      label: `川口典礼のGoogle口コミ（${operatorFacts.googleReviewCount}件）`,
    },
  ];
  return (
    <div>
      <dl
        className={`grid grid-cols-2 gap-px overflow-hidden rounded-xl sm:grid-cols-4 ${
          invert ? "bg-white/15" : "bg-gold/25"
        }`}
      >
        {items.map((it) => (
          <div
            key={it.label}
            className={`flex flex-col items-center justify-center px-2 py-4 text-center ${
              invert ? "bg-navy-dark/70 backdrop-blur-sm" : "bg-white"
            }`}
          >
            <dd
              className={`font-serif text-[22px] font-bold leading-tight tabular-nums sm:text-[26px] ${
                invert ? "text-gold-light" : "text-navy"
              }`}
            >
              {it.value}
            </dd>
            <dt
              className={`mt-1 text-[11px] leading-snug sm:text-xs ${
                invert ? "text-white/85" : "text-muted"
              }`}
            >
              {it.label}
            </dt>
          </div>
        ))}
      </dl>
      <p className={`mt-2 text-[11px] leading-relaxed ${invert ? "text-white/70" : "text-muted"}`}>
        ※ 運営・施行する{siteConfig.operator}（埼玉県川口市）全体の実績です。Google口コミは{operatorFacts.hallName}の評価（2026年9月確認）。
      </p>
    </div>
  );
}
