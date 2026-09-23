"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// ファーストビューに大きな電話ボタンがあるページでは、固定CTAがそのボタンを隠さないよう
// 少しスクロールしてから表示する。それ以外のページでは常に表示する。
const HERO_CTA = /^\/($|plan\/|area\/|hall\/[^/]+\/|contact\/)/;

// transform を祖先に付けると position: fixed が崩れるため、固定バー自身として描画する。
export function FixedCtaReveal({
  children,
  className = "",
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname() ?? "/";
  const delayed = HERO_CTA.test(pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!delayed) return;
    const onScroll = () => setScrolled(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [delayed]);

  const visible = !delayed || scrolled;
  return (
    <div
      {...rest}
      className={`${className} transition-transform duration-300 motion-reduce:transition-none ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-[120%]"
      }`}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
