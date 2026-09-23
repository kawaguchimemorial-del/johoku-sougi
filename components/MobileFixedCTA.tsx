import Link from "next/link";
import { siteConfig } from "@/app/config/site";
import { PhoneIcon } from "@/components/PhoneIcon";
import { formEnabled } from "@/lib/forms/config";
import { FixedCtaReveal } from "./FixedCtaReveal";

// スマホ用の固定CTA（電話／相談・見積り の2つ。電話を最優先で幅を広く）。
// iOSのセーフエリアを考慮し、コンテンツを隠しすぎないよう高さを抑える。
export function MobileFixedCTA() {
  return (
    <FixedCtaReveal
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-[3fr_2fr] border-t border-white/10 bg-navy-dark shadow-[0_-2px_12px_rgba(0,0,0,0.18)] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      data-cta-location="mobile_fixed"
    >
      <a
        href={siteConfig.telLink}
        className="flex min-h-16 flex-col items-center justify-center bg-gold-deep py-2 leading-tight text-white"
      >
        <span className="text-[16px] font-bold">
          <PhoneIcon className="mr-1 inline h-4 w-4 align-[-2px]" />電話で相談する
        </span>
        <span className="mt-0.5 text-[12px]">無料・24時間365日</span>
      </a>
      <Link
        href={formEnabled ? "/contact/#contact-form" : "/contact/"}
        data-cta="mobile_fixed_form"
        className="flex min-h-16 flex-col items-center justify-center py-2 leading-tight text-white"
      >
        <span className="text-[15px] font-bold">
          <span aria-hidden>✉ </span>相談・見積り
        </span>
        <span className="mt-0.5 text-[12px] text-white/85">
          {formEnabled ? "フォームで無料" : "ご相談の方法"}
        </span>
      </Link>
    </FixedCtaReveal>
  );
}
