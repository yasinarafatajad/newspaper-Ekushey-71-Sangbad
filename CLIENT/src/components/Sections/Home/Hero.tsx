import { articles } from "@/lib/newses";
import { formatDate, formatDay } from "@/lib/utils";
import { ClipboardClock } from "lucide-react"
import Image from "next/image";
import Link from "next/link"
import logo from '@/assets/logoLight.png'


export const Hero = () => {
    const latest = articles[0]

    return (
        <article className="mb-10 group cursor-pointer py-6">
            {/* thumbnail */}
            <div className="relative overflow-hidden rounded-xl mb-4 aspect-video">
                <Image className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Modern government building in Dhaka under clear blue sky"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbVQv4RUO1NgEuJtduHzGBF6U19TvO_ZFY_ZyujyEuJFrxyZASGX_x1Ln7b6o1KLyz8foOYJSn6u7E0H_bSnPQqaICiMrAm0YUHYbdN8b1Gb_YU2Dpu67SZTSQkvOCKkgsd3DQYu9Uly1zeoXkUDSgRaDsaPC0J9YiE-8YhEn1dF1DlCzkYob6dglMvQOdliIV2BhouFD4XNncXf-_AspAI3_n_LgozeyRjB41gVJdFmZgCLyEK5C3wMdplxhMDvQA65wQDR6NZaJR"
                    fill
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-bold">শীর্ষ সংবাদ</span>
                    <Image
                        src={logo}
                        alt="Ekushey 71 Sangbad"
                        width={180}
                        height={64}
                        className="h-16 lg:h-20 w-auto mt-4 -ml-4 pointer-events-none"
                    />
                </div>
            </div>
            {/* headline */}
            <Link href={`news/${latest?.slug}`}>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display leading-tight mb-3 group-hover:text-primary transition-colors">
                    {latest?.title}
                </h2>
            </Link>
            {/* content (short) */}
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4 line-clamp-3 md:line-clamp-none">
                {latest?.excerpt} <Link href={`news/${latest?.slug}`} className="text-primary">...See More</Link>
            </p>
            {/* time and author */}
            <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><ClipboardClock size={18} /> {formatDate(latest?.publishedAt)} , {formatDay(latest?.publishedAt)}</span>
            </div>
        </article>
    )
}
