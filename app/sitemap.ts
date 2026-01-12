import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { i18n } from "@/config/i18n";
import { professions } from "@/config/professions";

import { comparisons } from "@/config/comparisons";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = i18n.locales;
  
  // Static routes (Home, News, Pricing)
  const staticRoutes = ["", "/news", "/pricing"].flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1.0 : (route === "/pricing" ? 0.9 : 0.8),
    }))
  );

  // Dynamic: Profession Tools
  const professionRoutes = professions.flatMap((p) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}/tools/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // Dynamic: Comparisons (High Value)
  const comparisonRoutes = comparisons.flatMap((c) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}/vs/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))
  );

  return [...staticRoutes, ...professionRoutes, ...comparisonRoutes];
}
