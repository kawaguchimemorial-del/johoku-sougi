import Link from "next/link";
import { siteConfig } from "@/app/config/site";

// スマホ用の固定CTA（電話／相談・見積り の2つ）。
export function MobileFixedCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-white/10 shadow-[0_-2px_10px_rgba(0,0,0,0.15)] md:hidden">
      <a
        href={siteConfig.telLink}
        className="flex items-center justify-center gap-2 bg-gold py-3.5 font-bold text-white"
      >
        <span aria-hidden>📞</span>
        電話で相談
      </a>
      <Link
        href="/contact/"
        className="flex items-center justify-center gap-2 bg-navy py-3.5 font-bold text-white"
      >
        <span aria-hidden>✉</span>
        相談・見積り
      </Link>
    </div>
  );
}
