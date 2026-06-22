import type { Metadata, Viewport } from "next";
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
    <html lang="ja" className="h-full">
      <head>
        <GoogleTagManagerHead />
      </head>
      <body className="flex min-h-full flex-col bg-white">
        <GoogleTagManagerNoScript />
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileFixedCTA />
      </body>
    </html>
  );
}
