import type { Metadata } from "next";
import { siteConfig } from "@/app/config/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string; // "/area/kita-ku/" のように先頭・末尾スラッシュ付き
  noindex?: boolean;
};

// 各ページ共通のメタデータ生成（title / description / canonical / OG / Twitter / robots）
export function buildMetadata({
  title,
  description,
  path,
  noindex,
}: PageMetaInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle =
    path === "/" ? `${siteConfig.name}｜北区・板橋区の葬儀相談窓口` : `${title}｜${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      locale: siteConfig.locale,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [siteConfig.ogImage],
    },
  };
}
