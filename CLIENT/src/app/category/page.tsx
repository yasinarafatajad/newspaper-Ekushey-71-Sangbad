import { ArticleGrid } from "@/components/ui/ArticleGrid"
import { articles } from "@/lib/newses"
import Link from "next/link"

const Category = () => {

  if (!articles)
    return 'no article here'

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6 uppercase">News - based on all category</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map(news => (
          <Link key={news.id} href={`/news/${news.slug}`}>
            <ArticleGrid article={news} />
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Category