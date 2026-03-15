import { formatDate, formatDay } from '@/lib/utils'
import Image from 'next/image'
import { Article } from '@/lib/type';

export const ArticleGrid = ({ article }: { article: Article }) => {
    return (
        <div className="flex border border-primary rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 bg--background-light h-48">

            {/* Left Image */}
            <div className="relative w-1/3 h-48">
                <Image
                    src={article.featuredImage}
                    alt={article.bnTitle}
                    fill
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right Content */}
            <div className="w-2/3 p-4 flex flex-col justify-between">
                <h2 className="font-bold text-xl mb-2 text-text-main">
                    {article.bnTitle}
                </h2>

                <p className="text-gray-700 text-sm line-clamp-3 mb-2">
                    {article.content}
                </p>

                <p className="text-sm text-primary flex items-center gap-2 ">
                    <span>{formatDate(article.createdAt)},</span>
                    <span>{formatDay(article.createdAt)}</span>
                </p>
            </div>
        </div>
    )
}
