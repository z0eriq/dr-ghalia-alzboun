import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/clinic";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/services", "/about", "/contact", "/book"];
  return (["ar", "en"] as const).flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl()}/${locale}${path}`,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: {
          ar: `${siteUrl()}/ar${path}`,
          en: `${siteUrl()}/en${path}`,
        },
      },
    })),
  );
}
