import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/config/site";
import { plans } from "@/data/plans";
import { areas } from "@/data/areas";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/hall/",
    "/hall/toda-saijo/",
    "/faq/",
    "/company/",
    "/contact/",
    "/privacy/",
  ];

  const dynamicPaths = [
    ...plans.map((p) => p.href),
    ...areas.map((a) => a.href),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
