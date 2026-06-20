import { siteConfig } from "@/app/config/site";

type Props = {
  variant?: "primary" | "light";
  showNote?: boolean;
  className?: string;
};

// 電話CTAボタン。サイト共通の電話番号を使用。
export function CallButton({
  variant = "primary",
  showNote = true,
  className = "",
}: Props) {
  const base =
    "inline-flex flex-col items-center justify-center rounded-lg px-7 py-4 font-bold shadow-md transition hover:opacity-90";
  const styles =
    variant === "light"
      ? "bg-white text-navy"
      : "bg-gold text-white";

  return (
    <a href={siteConfig.telLink} className={`${base} ${styles} ${className}`}>
      <span className="text-xs font-medium tracking-wide opacity-90">
        お電話でのご相談（無料）
      </span>
      <span className="text-2xl leading-tight tracking-wider sm:text-3xl">
        {siteConfig.tel}
      </span>
      {showNote && (
        <span className="text-xs font-medium opacity-90">
          {siteConfig.telNote}
        </span>
      )}
    </a>
  );
}
