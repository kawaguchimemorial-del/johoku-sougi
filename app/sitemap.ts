import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/config/site";
import { plans } from "@/data/plans";
import { areas } from "@/data/areas";
import { halls } from "@/data/halls";
import { columns } from "@/data/columns";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/hall/",
    "/column/",
    "/faq/",
    "/company/",
    "/contact/",
    "/privacy/",
  ];

  const dynamicPaths = [
    ...halls.map((h) => h.href),
    ...plans.map((p) => p.href),
    ...areas.map((a) => a.href),
    ...columns.map((c) => `/column/${c.slug}/`),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
