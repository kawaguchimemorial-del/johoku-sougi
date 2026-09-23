import { siteConfig, operatorFacts } from "@/app/config/site";
import type { Faq } from "@/data/faqs";

// 注意: 存在しない住所・営業所は作らない。areaServed のみで地域性を示す。

// 対応エリア名の配列を schema.org の AdministrativeArea 配列にする。
const adminAreas = (names: readonly string[]) =>
  names.map((name) => ({ "@type": "AdministrativeArea", name }));

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FuneralHome",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.tel,
    image: `${siteConfig.url}${siteConfig.defaultImage}`,
    priceRange: "¥¥",
    areaServed: adminAreas(siteConfig.areas.filter((a) => a.startsWith("東京都"))),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [siteConfig.parentSiteUrl],
    // 運営会社（川口典礼）は本体サイトのエンティティと @id で名寄せする。
    // 住所は本体（埼玉県川口市）のもの。北区・板橋区に店舗があるようには見せない。
    parentOrganization: operatorLd(),
  };
}

// 運営会社（川口典礼）。@id は本体サイト kawaguchitenrei.com の Organization と同一。
export function operatorLd() {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.parentSiteUrl}#organization`,
    name: siteConfig.operator,
    legalName: operatorFacts.legalName,
    url: siteConfig.parentSiteUrl,
    telephone: siteConfig.tel,
    foundingDate: String(operatorFacts.foundedYear),
    address: {
      "@type": "PostalAddress",
      postalCode: operatorFacts.postal,
      addressRegion: "埼玉県",
      addressLocality: "川口市",
      streetAddress: "西新井宿440-1",
      addressCountry: "JP",
    },
    sameAs: [operatorFacts.googleReviewsUrl],
  };
}

// 葬儀プランの Service スキーマ（価格は載せず、提供主体・対応エリアを明示）。
export function serviceLd(input: {
  name: string;
  description: string;
  path: string;
  // 未指定なら siteConfig の対応エリア（東京都内）を使う
  areaServed?: string[];
  // プラン料金の目安（税込）。式場・火葬料金などは含まない旨を description に書く
  price?: number;
}) {
  const served =
    input.areaServed && input.areaServed.length > 0
      ? input.areaServed
      : siteConfig.areas.filter((a) => a.startsWith("東京都"));
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: input.name,
    name: input.name,
    description: input.description,
    url: `${siteConfig.url}${input.path}`,
    provider: { "@id": `${siteConfig.url}#organization` },
    areaServed: adminAreas(served),
    ...(input.price
      ? {
          offers: {
            "@type": "Offer",
            price: input.price,
            priceCurrency: "JPY",
            priceSpecification: {
              "@type": "PriceSpecification",
              price: input.price,
              priceCurrency: "JPY",
              valueAddedTaxIncluded: true,
            },
            description:
              "プラン料金の目安（税込）。式場使用料・火葬料金・宗教者へのお礼・返礼品・飲食費などは含まず、内容により変動します。正確な費用は個別にお見積りします。",
          },
        }
      : {}),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "ja",
    publisher: { "@id": `${siteConfig.parentSiteUrl}#organization` },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  // 「ホーム」1件だけのパンくずは意味を持たないため出力しない
  if (items.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function articleLd(input: {
  title: string;
  description: string;
  path: string;
  updated: string;
  image?: string;
  reviewer?: {
    name: string;
    title: string;
    credentials?: string[];
    sameAs?: string[];
  } | null;
}) {
  const image = input.image ?? siteConfig.defaultImage;
  // 監修者名が会社名（川口典礼）のままのときは Person として出さない（実在個人名の確定後に出す）
  const reviewedBy =
    input.reviewer && input.reviewer.name && input.reviewer.name !== siteConfig.operator
      ? {
          reviewedBy: {
            "@type": "Person",
            name: input.reviewer.name,
            jobTitle: input.reviewer.title,
            ...(input.reviewer.credentials &&
            input.reviewer.credentials.length > 0
              ? { hasCredential: input.reviewer.credentials }
              : {}),
            ...(input.reviewer.sameAs && input.reviewer.sameAs.length > 0
              ? { sameAs: input.reviewer.sameAs }
              : {}),
          },
        }
      : {};
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    inLanguage: "ja",
    datePublished: input.updated,
    dateModified: input.updated,
    mainEntityOfPage: `${siteConfig.url}${input.path}`,
    image: `${siteConfig.url}${image}`,
    author: { "@id": `${siteConfig.parentSiteUrl}#organization`, "@type": "Organization", name: siteConfig.operator, url: siteConfig.parentSiteUrl },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      // Article リッチリザルトの必須プロパティ（PNG のブランド画像を動的生成）
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/opengraph-image/`,
        width: 1200,
        height: 630,
      },
    },
    ...reviewedBy,
  };
}

export function faqLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
