import { api } from "@/lib/useApi/api";
import { Article } from "@/lib/type";

export default async function sitemap() {
  const res = await fetch(`${api}/AllNews`);
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
}