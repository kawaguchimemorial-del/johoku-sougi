import { siteConfig } from "@/app/config/site";
import { PhoneIcon } from "./PhoneIcon";

type Props = {
  variant?: "primary" | "light";
  showNote?: boolean;
  className?: string;
};

// 電話CTAボタン。サイト共通の電話番号を使用。
// 金背景は白文字とのコントラストを満たす濃い金（gold-deep）を使う。
export function CallButton({
  variant = "primary",
  showNote = true,
  className = "",
}: Props) {
  const base =
    "inline-flex flex-col items-center justify-center rounded-xl px-7 py-4 font-bold shadow-md transition";
  const styles =
    variant === "light"
      ? "bg-white text-navy hover:bg-cream"
      : "bg-gold-deep text-white hover:bg-navy";

  return (
    <a
      href={siteConfig.telLink}
      className={`${base} ${styles} ${className}`}
      aria-label={`電話で相談する ${siteConfig.tel}（${siteConfig.telNote}）`}
    >
      <span className="flex items-center gap-1.5 text-[13px] font-bold tracking-wide">
        <PhoneIcon className="h-4 w-4" />
        無料・24時間365日受付
      </span>
      <span className="font-serif text-[28px] leading-tight tracking-wider tabular-nums sm:text-[32px]">
        {siteConfig.tel}
      </span>
      {showNote && (
        <span className="text-[12px] font-medium">お迎え・安置・斎場の空き確認もこちらへ</span>
      )}
    </a>
  );
}
