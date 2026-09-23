import type { Metadata, Viewport } from "next";
import { Shippori_Mincho } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/app/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileFixedCTA } from "@/components/MobileFixedCTA";
import { JsonLd } from "@/components/JsonLd";
import {
  GoogleTagManagerHead,
  GoogleTagManagerNoScript,
} from "@/components/GoogleTagManager";
import { organizationLd, websiteLd } from "@/lib/jsonld";
import { Analytics } from "@vercel/analytics/next";
import { TrackClicks } from "@/components/TrackClicks";

// 見出し専用の明朝体。日本語フォントは重いので preload せず、swap で本文表示を妨げない。
const mincho = Shippori_Mincho({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-mincho",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}｜北区・板橋区の葬儀相談窓口`,
    template: `%s｜${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
};

export const viewport: Viewport = {
  themeColor: "#1b2a4a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`h-full ${mincho.variable}`}>
      <head>
        <GoogleTagManagerHead />
      </head>
      <body className="flex min-h-full flex-col bg-white">
        <GoogleTagManagerNoScript />
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <a
          href="#main"
          className="sr-only z-[60] rounded bg-white px-4 py-2 font-bold text-navy focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
        >
          本文へスキップ
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileFixedCTA />
        <TrackClicks />
        <Analytics />
      </body>
    </html>
  );
}
