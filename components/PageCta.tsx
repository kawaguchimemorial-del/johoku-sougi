import Link from "next/link";
import { siteConfig } from "@/app/config/site";
import { formEnabled } from "@/lib/forms/config";
import { PhoneIcon } from "./PhoneIcon";

// 下層ページ用のコンパクトな相談CTA（電話を主、フォームを従）。
// query はフォームの選択肢を事前に選ぶためのクエリ（例 "plan=one-day"）。
export function PageCta({
  location,
  query,
  formLabel = "費用の見積りを依頼する",
  invert = false,
  className = "",
}: {
  location: string;
  query?: string;
  formLabel?: string;
  invert?: boolean;
  className?: string;
}) {
  const formHref = formEnabled
    ? `/contact/${query ? `?${query}` : ""}#contact-form`
    : "/contact/";
  return (
    <div
      data-cta-location={location}
      className={`flex flex-col gap-3 sm:flex-row sm:items-stretch ${className}`}
    >
      <a
        href={siteConfig.telLink}
        className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-gold-deep px-6 py-2 text-white shadow-md transition hover:bg-navy-light"
        aria-label={`電話で相談する ${siteConfig.tel}（24時間365日・無料）`}
      >
        <PhoneIcon className="h-6 w-6 shrink-0" />
        <span className="text-left leading-tight">
          <span className="block text-[12px] font-bold">無料・24時間365日</span>
          <span className="block font-serif text-2xl font-bold tracking-wider tabular-nums">
            {siteConfig.tel}
          </span>
        </span>
      </a>
      <Link
        href={formHref}
        data-cta={`${location}_form`}
        className={`inline-flex min-h-14 items-center justify-center rounded-xl border px-6 text-center font-bold transition ${
          invert
            ? "border-white/40 text-white hover:bg-white/10"
            : "border-navy text-navy hover:bg-navy/5"
        }`}
      >
        {formEnabled ? `${formLabel}（無料）` : "ご相談・お見積りについて"}
      </Link>
    </div>
  );
}
