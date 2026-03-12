// /app/news/[slug]/page.tsx
import { Aside } from "@/components/Layout/Aside"
import { MainLayout } from "@/components/Layout/MainLayout"
import { ArticleCard } from "@/components/ui/ArticleCard"
import Image from "next/image"
import Link from "next/link"
import { Author } from "@/components/ui/Author"
import authorSrc from '@/assets/icon.png'
import { articles } from "@/lib/newses"
import { Article } from "@/lib/type"
import { Activity } from "lucide-react"

interface PageProps {
    params: {
        slug: string
    }
}

// **Server Component**
const Page = async (props: PageProps) => {
    const { slug } = await props.params 

    // Find the article
    const article: Article | undefined = await articles.find(a => a.slug === slug)

    if (!article) {
        return (
            <main className="container py-8">
                <h1 className="text-3xl font-bold">Article not found</h1>
            </main>
        )
    }

    // Related articles (same category, exclude current article)
    const related: Article[] = articles.filter(
        a => a.categoryEN === article.categoryEN && a.slug !== slug
    )

    return (
        <main className="container py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link className="hover:text-primary" href="/">Home</Link>
                <span className="material-symbols-outlined text-xs">/</span>
                <Link className="hover:text-primary" href={`/category/${article.categoryEN}`}>
                    {article.categoryBN}
                </Link>
                <span className="material-symbols-outlined text-xs">/</span>
                <span className="text-primary font-medium">{article.title}</span>
            </div>

            <MainLayout>
                <main className="lg:col-span-8">
                    <article>
                        <h1 className="md:text-5xl font-bold leading-tight mb-6 text-slate-900 dark:text-slate-50 text-2xl">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between border-y border-primary/10 py-6 mb-8 gap-4">
                            <Author
                                name={article.author.title}
                                src={authorSrc}
                                location={article.author.location}
                                publishedAt={article.publishedAt}
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-nowrap text-xl">click to share:</span>
                                <button className="bg-primary/90 hover:bg-primary/75 rounded px-4 py-2 text-neutral-subtle text-nowrap transition-colors">
                                    ফেসবুক
                                </button>
                            </div>
                        </div>

                        <figure className="mb-8">
                            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-200">
                                <Image
                                    fill
                                    alt={article.title}
                                    className="w-full h-full object-cover pointer-events-none"
                                    src={article.featuredImage}
                                />
                            </div>
                            <figcaption className="mt-3 text-sm text-slate-500 italic border-l-2 border-primary pl-4">
                                {article.imageCaption}
                            </figcaption>
                        </figure>

                        <div className="serif-font md:text-xl leading-relaxed text-slate-800 dark:text-slate-200 text-base">
                            {article.content.split("\n\n").map((p, i) => (
                                <p key={i} className="mb-8">{p}</p>
                            ))}
                        </div>

                        <div className="mt-12 flex flex-wrap gap-2">
                            {article.tags.map((tag, i) => (
                                <span key={i} className="text-sm font-medium px-3 py-1 rounded bg-primary/10 text-primary">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </article>
                </main>
                <Aside />
            </MainLayout>

            {related?.length > 0 && (
                <section className="mt-20">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <Activity className="text-primary" />
                        সম্পর্কিত খবর
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 grid-cols-1">
                        {related.map(a => <ArticleCard key={a.id} props={a} />)}
                    </div>
                </section>
            )}
        </main>
    )
}

export default Page