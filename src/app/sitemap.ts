// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { DUMMY_GAMES } from "@/lib/dummy-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://topupgame.id";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/top-up`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/joki`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/promo`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/lacak`, lastModified, changeFrequency: "always", priority: 0.8 },
    { url: `${baseUrl}/tentang`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/kontak`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/syarat-ketentuan`, lastModified, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/kebijakan-privasi`, lastModified, changeFrequency: "monthly", priority: 0.4 },
  ];

  const gameTopupRoutes: MetadataRoute.Sitemap = DUMMY_GAMES.map((game) => ({
    url: `${baseUrl}/top-up/${game.slug}`,
    lastModified,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const gameJokiRoutes: MetadataRoute.Sitemap = DUMMY_GAMES.filter((g) => g.hasJoki).map((game) => ({
    url: `${baseUrl}/joki/${game.slug}`,
    lastModified,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  return [...staticRoutes, ...gameTopupRoutes, ...gameJokiRoutes];
}
