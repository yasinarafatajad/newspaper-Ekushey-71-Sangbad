import { AUTHOR } from "@/lib/type"
import { formatDate, formatDay } from "@/lib/utils"
import Image from "next/image"

export const Author = ({ name, src, location, publishedAt }: AUTHOR) => {
    return (
        <div className="flex items-center gap-3 mb-4">
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
                <p className="text-slate-900 font-bold uppercase">{name}</p>
                <span className="flex items-baseline gap-1.5 text-sm text-slate-500">
                    <span>{location}</span>
                    <span>|</span>
                    <span className="flex gap-2">
                        <span>{formatDate(publishedAt)},</span>
                        <span>{formatDay(publishedAt)}</span>
                    </span>
                </span>
            </div>
        </div>
    )
}
