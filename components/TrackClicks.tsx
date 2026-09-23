"use client";

import { useEffect } from "react";
import { pushEvent } from "@/lib/analytics";

// 電話タップ・CTAクリックを dataLayer に送る（GTM で GA4 イベント化）。
// 各ボタンに onClick を書かず、委譲で一括計測する。
//  - tel: リンク → event "phone_tap"（cta_location = 最寄りの data-cta-location）
//  - data-cta 属性のリンク → event "cta_click"（cta_id = data-cta）
export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("a");
      if (!el) return;
      const location =
        el.closest<HTMLElement>("[data-cta-location]")?.dataset.ctaLocation ?? "body";
      const href = el.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) {
        pushEvent("phone_tap", { cta_location: location });
      } else if (el.dataset.cta) {
        pushEvent("cta_click", { cta_id: el.dataset.cta, cta_location: location });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
