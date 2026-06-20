import { Container } from "./Container";
import { CallButton } from "./CallButton";
import { ctaText } from "@/app/config/site";

// ページ下部などで使う共通の相談CTAブロック。
export function CtaSection({
  heading = ctaText.primary,
}: {
  heading?: string;
}) {
  return (
    <section className="bg-navy py-14 text-white">
      <Container className="text-center">
        <h2 className="text-xl font-bold leading-relaxed sm:text-2xl">
          {heading}
        </h2>
        <p className="mt-3 text-sm text-white/80">
          病院・施設からのお迎え、安置先のご相談、斎場の空き確認、お見積りまで、
          まずはお気軽にお電話ください。
        </p>
        <div className="mt-7 flex justify-center">
          <CallButton variant="light" />
        </div>
        <ul className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/85">
          {ctaText.appeals.map((a) => (
            <li key={a} className="flex items-center gap-1.5">
              <span className="text-gold-light">●</span>
              {a}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
