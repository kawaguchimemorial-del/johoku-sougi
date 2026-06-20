import Link from "next/link";
import { siteConfig } from "@/app/config/site";

// スマホ用の固定CTA（電話／相談・見積り の2つ）。
// iOSのセーフエリアを考慮し、コンテンツを隠しすぎないよう高さを抑える。
export function MobileFixedCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-white/10 bg-navy-dark shadow-[0_-2px_12px_rgba(0,0,0,0.18)] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <a
        href={siteConfig.telLink}
        className="flex flex-col items-center justify-center bg-gold py-2.5 leading-tight text-white"
      >
        <span className="text-[15px] font-bold">📞 電話で相談する</span>
        <span className="text-[10px] opacity-90">24時間365日・無料</span>
      </a>
      <Link
        href="/contact/"
        className="flex flex-col items-center justify-center py-2.5 leading-tight text-white"
      >
        <span className="text-[15px] font-bold">✉ 相談・見積り</span>
        <span className="text-[10px] opacity-90">空き確認・搬送も相談</span>
      </Link>
    </div>
  );
}
