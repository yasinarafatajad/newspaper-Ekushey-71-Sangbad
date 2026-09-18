import { ArticleGrid } from "@/components/ui/ArticleGrid";
import { getAllNews } from "@/lib/useApi/api";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ekushey 71 Sangbad | All News",
  description: "All News",
};

const Page = async () => {
  const articles = await getAllNews();
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 uppercase"> সর্বশেষ সংবাদ</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...(articles || [])].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).map(news => (
          <Link key={news._id} href={`/news/${news.slug}`}>
            <ArticleGrid article={news} />
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Page