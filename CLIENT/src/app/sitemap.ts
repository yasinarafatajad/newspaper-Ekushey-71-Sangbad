import { api } from "@/lib/useApi/api";
import { Article } from "@/lib/type";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${api}/AllNews`);
    if (!res.ok) throw new Error("Failed to fetch news for sitemap");
    const news: Article[] = await res.json();

    const articles = news.map((item) => ({
      url: `https://ekushey71sangbad.vercel.app/news/${item.slug}`,
      lastModified: new Date(item.createdAt),
    }));

    return [
      {
        url: "https://ekushey71sangbad.vercel.app",
        lastModified: new Date(),
      },
      ...articles,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [
      {
        url: "https://ekushey71sangbad.vercel.app",
        lastModified: new Date(),
      },
    ];
  }
}