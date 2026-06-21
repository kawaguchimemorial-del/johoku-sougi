import { siteConfig } from "@/app/config/site";
import type { Faq } from "@/data/faqs";

// 注意: 存在しない住所・営業所は作らない。areaServed のみで地域性を示す。

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FuneralHome",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.tel,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    areaServed: [
      { "@type": "AdministrativeArea", name: "東京都北区" },
      { "@type": "AdministrativeArea", name: "東京都板橋区" },
    ],
    openingHours: "Mo-Su 00:00-24:00",
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.operator,
      url: siteConfig.parentSiteUrl,
    },
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
}) {
  const image = input.image ?? siteConfig.ogImage;
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
