import { getAllNews } from "@/lib/useApi/api";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const news = await getAllNews();

    const articles = news.map((item) => ({
      url: `https://ekushey71sangbad.ami.bd/news/${item.slug}`,
      lastModified: new Date(item.createdAt),
    }));

    return [
      {
        url: "https://ekushey71sangbad.ami.bd",
        lastModified: new Date(),
      },
      ...articles,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [
      {
        url: "https://ekushey71sangbad.ami.bd",
        lastModified: new Date(),
      },
    ];
  }
}