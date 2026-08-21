import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gedosalons.com";

// Single-page marketing site: one sitemap entry per in-page section anchor.
// If/when the site grows real sub-pages, add them here.
export default function sitemap(): MetadataRoute.Sitemap {
  const sections = ["", "#services", "#offers", "#about", "#barbers", "#branches", "#gallery", "#contact"];

  return sections.map((section) => ({
    url: `${SITE_URL}/${section}`,
    lastModified: new Date(),
    changeFrequency: section === "" ? "weekly" : "monthly",
    priority: section === "" ? 1 : 0.6,
  }));
}
