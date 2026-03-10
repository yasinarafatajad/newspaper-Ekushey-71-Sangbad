import { articles } from '@/lib/newses'
import { Article } from '@/lib/type'
import { formatDate, formatDay } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export const Category = () => {
    const groupedArticles: Record<string, Article[]> = articles.reduce(
        (acc, article) => {
            const category = article.categoryEN;

            if (!acc[category]) {
                acc[category] = [];
            }

            acc[category].push(article);

            return acc;
        },
        {} as Record<string, Article[]>
    );

    return (
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-neutral-muted pt-8">

            {Object.entries(groupedArticles).map(([category, news]) => (

                <div key={category}>

                    {/* category title */}
                    <h3 className="text-xl font-bold border-l-2 border-primary pl-1.5 mb-6">
                        {category}
                    </h3>

                    <div className="flex flex-col gap-3">

                        {news?.reverse().slice(0, 2).map((article) => {
                            const date = new Date(article.publishedAt)

                            return (
                                <Link key={article.id} href={`/news/${article.slug}`}>
                                    <div className="flex gap-4 group cursor-pointer">

                                        {/* image */}
                                        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                                            <Image
                                                className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform"
                                                alt={article.title}
                                                src={article.featuredImage}
                                                fill
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* content */}
                                        <div>
                                            <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h4>

                                            <span className="text-xs text-slate-500">
                                                {formatDate(date.toISOString())}, {formatDay(date.toISOString())}
                                            </span>
                                        </div>

                                    </div>
                                </Link>
                            )
                        })}

                    </div>
                </div>

            ))}

        </div>
    )
}
