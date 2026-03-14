import { Article } from "@/lib/type"
import { formatDate, formatDay } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export const ArticleCard = ({ props }: {props : Article}) => {
    return (
        <Link href={`/news/${props.slug}`} className="group cursor-pointer">
            <div className="border border-primary aspect-square overflow-hidden rounded-lg mb-3">
                <Image className=" w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform"
                    alt={props.bnTitle}
                    src={props.featuredImage}
                    height={400}
                    width={400}
                    loading="lazy"
                />
            </div>
            <div className="p-4">
                <h4 className="font-bold group-hover:text-primary transition-colors">{props.bnTitle}</h4>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500">{formatDate(props.createdAt)}</p>
                    <p className="text-xs text-slate-500">|</p>
                    <p className="text-xs text-slate-500">{formatDay(props.createdAt)}</p>
                </div>
            </div>
        </Link>
    )
}
