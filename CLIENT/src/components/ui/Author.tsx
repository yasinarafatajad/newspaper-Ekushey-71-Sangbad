import { AUTHOR } from "@/lib/type"
import { formatDate, formatDay } from "@/lib/utils"
import Image from "next/image"

export const Author = ({ name, src, title, location, publishedAt }: AUTHOR) => {
    return (
        <div className="flex items-start gap-3 mb-4">
            <div className="overflow-hidden h-14 w-14 aspect-square border-2 rounded-full border-primary">
                <Image
                    src={src}
                    alt={name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover rounded-full pointer-events-none"
                />
            </div>
            <div className="flex flex-col items-start">
                <p className="text-slate-800 font-medium">{name}</p>
                <span className="flex items-baseline gap-0.5 text-sm text-slate-500">
                    <span className="flex items-baseline gap-1.5 text-sm text-slate-500">{title}</span>
                    <span>|</span>
                    <span>{location}</span>
                </span>
                    <span className="flex gap-2 text-sm text-primary">
                        <span>{formatDate(publishedAt)},</span>
                        <span>{formatDay(publishedAt)}</span>
                    </span>
            </div>
        </div>
    )
}
