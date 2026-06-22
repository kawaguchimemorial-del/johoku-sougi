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
  // <title> は社名を付けない（社名が長く SERP で末尾が切れるため）。トップのみ社名入り。
  // 社名は OG/Twitter・H1・ヘッダーに残すのでブランドは保持される。
  const pageTitle =
    path === "/" ? `${siteConfig.name}｜北区・板橋区の葬儀相談窓口` : title;
  // OG/Twitter は表示領域に余裕があり、ブランド露出が有効なので社名を付ける。
  const socialTitle =
    path === "/" ? pageTitle : `${title}｜${siteConfig.name}`;

  return {
    // absolute にして layout の title.template（%s｜サイト名）の二重付与を防ぐ
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      locale: siteConfig.locale,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
  };
}
