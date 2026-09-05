import { siteConfig } from "@/app/config/site";
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
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.operator,
      url: siteConfig.parentSiteUrl,
    },
  };
}

// 葬儀プランの Service スキーマ（価格は載せず、提供主体・対応エリアを明示）。
export function serviceLd(input: {
  name: string;
  description: string;
  path: string;
  // 未指定なら siteConfig の対応エリア（東京都内）を使う
  areaServed?: string[];
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
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "ja",
    publisher: { "@type": "Organization", name: siteConfig.operator },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
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
  const reviewedBy =
    input.reviewer && input.reviewer.name
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
    author: {
      "@type": "Organization",
      name: siteConfig.operator,
      url: siteConfig.parentSiteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
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
