import { ArticleGrid } from "@/components/ui/ArticleGrid";
import { Article } from "@/lib/type";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ekushey 71 Sangbad | All News",
  description: "All News",
};

// fetch articles
const getAllNews = async (): Promise<Article[]> => {
  try {
    const res = await fetch("http://localhost:5000/api/v1/AllNews");

    if (!res.ok) {
      throw new Error("Failed to fetch news");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
const page = async () => {
  const articles = await getAllNews();
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 uppercase"> সর্বশেষ সংবাদ</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map(news => (
          <Link key={news._id} href={`/news/${news.slug}`}>
            <ArticleGrid article={news} />
          </Link>
        ))}
      </div>
    </main>
  )
}

export default page