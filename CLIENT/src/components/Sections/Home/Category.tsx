import { Article } from '@/lib/type'
import { formatDate, formatDay } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryProps {
    categories: Record<string, Article[]>;
}
export const Category = ({  categories }: CategoryProps) => {
    return (
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-neutral-muted pt-8">

            {Object.entries(categories).map(([category, news]) => (
                <div key={category}>
                    {/* category title */}
                    <h3 className="text-xl font-bold border-l-2 border-primary pl-1.5 mb-6">
                        {category}
                    </h3>

                    <div className="flex flex-col gap-3">

                        {news?.reverse().slice(0, 4).map((article) => {
                            const date: string = new Date(article.createdAt).toISOString()

                            return (
                                <Link key={article._id} href={`/news/${article.slug}`}>
                                    <div className="flex gap-4 group cursor-pointer">

                                        {/* image */}
                                        <div className="relative w-36 h-36 shrink-0 rounded-lg overflow-hidden">
                                            <Image
                                                className="w-full h-full object-cover pointer-events-none transition-transform"
                                                alt={article.bnTitle}
                                                src={article.featuredImage}
                                                fill
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* content */}
                                        <div>
                                            <h4 className="font-bold leading-tight group-hover:text-primary transition-colors">
                                                {article.bnTitle}
                                            </h4>

                                            <span className="text-xs text-slate-500">
                                                {formatDate(date)}, {formatDay(date)}
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
