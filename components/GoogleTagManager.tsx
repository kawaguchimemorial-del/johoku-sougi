import Script from "next/script";
import { siteConfig } from "@/app/config/site";

// GTM の head 用スクリプト。gtmId 未設定なら何も出力しない。
export function GoogleTagManagerHead() {
  const id = siteConfig.gtmId;
  if (!id) return null;
  return (
    <Script id="gtm-base" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
    </Script>
  );
}

// GTM の <body> 直後用 noscript。gtmId 未設定なら何も出力しない。
export function GoogleTagManagerNoScript() {
  const id = siteConfig.gtmId;
  if (!id) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
