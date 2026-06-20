import type { Metadata } from "next";
import { siteConfig } from "@/app/config/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string; // "/area/kita-ku/" のように先頭・末尾スラッシュ付き
  noindex?: boolean;
  image?: string; // OG画像（public 配下の絶対パス）。未指定なら共通OG画像
};

// 各ページ共通のメタデータ生成（title / description / canonical / OG / Twitter / robots）
export function buildMetadata({
  title,
  description,
  path,
  noindex,
  image,
}: PageMetaInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? siteConfig.ogImage;
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
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
