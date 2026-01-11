import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { i18n } from "@/config/i18n";
import { professions } from "@/config/professions";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = i18n.locales;
  
  // Static routes
  const staticRoutes = [""].flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    }))
  );

  // Dynamic profession tools routes
  const professionRoutes = professions.flatMap((p) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}/tools/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  return [...staticRoutes, ...professionRoutes];
}
