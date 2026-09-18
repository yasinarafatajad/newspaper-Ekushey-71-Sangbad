import { ArticleGrid } from "@/components/ui/ArticleGrid"
import { getAllNews } from "@/lib/useApi/api";
import Link from "next/link"

const Category = async () => {
  const articles = await getAllNews();

  if (!articles)
    return 'no article here'

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 uppercase">সংবাদ - সকল বিভাগের ওপর ভিত্তি করে</h1>
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

export default Category