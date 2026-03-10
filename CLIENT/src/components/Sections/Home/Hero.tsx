import { articles } from "@/lib/newses";
import Image from "next/image";
import Link from "next/link"
import logo from '@/assets/logoLight.png'
import authorSrc from '@/assets/icon.png'
import { Author } from "@/components/ui/Author";


export const Hero = () => {
    const latest = articles[articles.length - 1]

    return (
        <article className="mb-2 group cursor-pointer py-6">
            {/* thumbnail */}
            <div className="relative overflow-hidden rounded-xl mb-4 aspect-video">
                <Image className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                    alt="Modern government building in Dhaka under clear blue sky"
                    src={latest?.featuredImage}
                    fill
                    loading="lazy"
                />
                <div className=" flex justify-between items-start absolute top-4 px-4 w-full">
                    <Image
                        src={logo}
                        alt="Ekushey 71 Sangbad"
                        width={230}
                        height={48}
                        loading="lazy"
                        className="h-12 w-auto pointer-events-none"
                    />
                    <span className="bg-primary text-white px-3 py-1 mt-2.5 lg:mt-3 rounded-lg text-sm font-bold text-nowrap">শীর্ষ সংবাদ</span>
                </div>
            </div>
            {/* headline */}
            <Link href={`news/${latest?.slug}`}>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display leading-tight mb-3 group-hover:text-primary transition-colors">
                    {latest?.title}
                </h2>
            </Link>
            {/* time and author */}
            <Author
                name={latest?.author?.title}
                src={authorSrc}
                publishedAt={latest?.publishedAt}
                location={latest?.author.location}
            />
            {/* content (short) */}
            <div className="">
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4 line-clamp-4 md:line-clamp-none">
                    {latest?.content}
                </p>
                <Link href={`news/${latest?.slug}`} className="bg-primary/90 hover:bg-primary/75 rounded px-4 py-2 text-neutral-subtle text-nowrap transition-colors">See More</Link>
            </div>
        </article>
    )
}
