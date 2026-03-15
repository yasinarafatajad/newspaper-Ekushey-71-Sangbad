import Image from "next/image";
import Link from "next/link"
import logo from '@/assets/logoLight.png'
import { Author } from "@/components/ui/Author";
import { Article } from '../../../lib/type';

interface HeroProps {
    latest: Article;
}
export const Hero = ({ latest }: HeroProps) => {
    return (
        <article className="mb-2 group cursor-pointer py-6">
            {/* thumbnail */}
            <div className="wrapper w-full overflow-hidden rounded-t-xl">
                <div className="relative w-full  aspect-video">
                    <Image className="object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                        alt={latest?.bnTitle}
                        src={latest?.featuredImage}
                        fill
                        loading="lazy"
                    />
                </div>
                {/* logo after main image */}
                <div className="w-auto mb-4 rounded-b-xl bg-amber-300 flex items-center justify-center py-1">
                    <Image
                        src={logo}
                        alt="Ekushey 71 Sangbad"
                        width={139}
                        height={29}
                        loading="lazy"
                        className="object-cover pointer-events-none"
                    />
                </div>
            </div>
            {/* headline */}
            <Link href={`news/${latest?.slug}`}>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display leading-tight mb-3 group-hover:text-primary transition-colors">
                    {latest?.bnTitle}
                </h2>
            </Link>
            {/* time and author */}
            <Author
                name={latest?.author?.name}
                title={latest?.author?.title}
                src={latest?.author?.src}
                publishedAt={latest?.createdAt}
                location={latest?.author?.location}
            />
            {/* content (short) */}
            <div className="mt-3">
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4 line-clamp-4">
                    {latest?.content}
                </p>
                <Link href={`news/${latest?.slug}`} className="bg-primary/90 hover:bg-primary/75 rounded px-4 py-2 text-neutral-subtle text-nowrap transition-colors">See More</Link>
            </div>
        </article>
    )
}
