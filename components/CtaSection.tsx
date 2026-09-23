import Link from "next/link";
import { Container } from "./Container";
import { CallButton } from "./CallButton";
import { ctaText } from "@/app/config/site";
import { formEnabled } from "@/lib/forms/config";

// ページ下部などで使う共通の相談CTAブロック。電話を主、フォームを従にする。
export function CtaSection({
  heading = "ひとりで抱え込まず、まずはご相談ください",
}: {
  heading?: string;
}) {
  return (
    <section className="bg-navy py-14 text-white sm:py-20" data-cta-location="cta_section">
      <Container className="text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-gold-light">CONTACT</p>
        <h2 className="mt-3 font-serif text-[26px] font-bold leading-relaxed sm:text-[32px]">
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-[1.9] text-white/80">
          病院・施設からのお迎え、ご安置先、斎場の空き確認、お見積りまで。
          {ctaText.primary.replace("まずは", "")}。
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CallButton variant="light" />
          <Link
            href={formEnabled ? "/contact/#contact-form" : "/contact/"}
            data-cta="cta_section_form"
            className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/40 px-7 font-bold text-white transition hover:bg-white/10"
          >
            {formEnabled ? "フォームで相談・見積り（無料）" : "ご相談・お見積りについて"}
          </Link>
        </div>
        <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/85">
          {["24時間365日受付", "ご相談・お見積り無料", "病院・施設からのお迎え"].map((a) => (
            <li key={a} className="flex items-center gap-1.5">
              <span aria-hidden className="text-gold-light">●</span>
              {a}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
