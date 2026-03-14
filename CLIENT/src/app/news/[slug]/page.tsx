// /app/news/[slug]/page.tsx
import { Aside } from "@/components/Layout/Aside"
import { MainLayout } from "@/components/Layout/MainLayout"
import { ArticleCard } from "@/components/ui/ArticleCard"
import Image from "next/image"
import Link from "next/link"
import { Author } from "@/components/ui/Author"
import authorSrc from '@/assets/icon.png'
import { Article } from "@/lib/type"
import { Activity } from "lucide-react"
import ShareFacebook from "@/components/ui/ShareFacebook"
import CopyFacebookCaption from "@/components/ui/CopyFacebookCaption"

interface PageProps {
    params: {
        slug: string
    }
}

// fetch articles
const getAllNews = async (): Promise<Article[]> => {
    try {
        const res = await fetch("http://localhost:5000/api/v1/AllNews");

        if (!res.ok) {
            throw new Error("Failed to fetch news");
        }

        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

const Page = async (props: PageProps) => {
    const { slug } = await props.params

    // fetch all articles
    const articles = await getAllNews();
    // fetch article
    const getNews = async (): Promise<Article | null> => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/news/${slug}`);

            if (!res.ok) {
                throw new Error("Failed to fetch news");
            }

            return res.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    const article = await getNews();

    if (!article) {
        return (
            <main className="container py-8">
                <h1 className="text-3xl font-bold">Article not found</h1>
            </main>
        )
    }

    // Related articles (same category, without current article)
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
                <span className="text-primary font-medium">{article.bnTitle}</span>
            </div>

            <MainLayout>
                <main className="lg:col-span-8">
                    <article>
                        <h1 className="md:text-5xl font-bold leading-tight mb-6 text-slate-900 dark:text-slate-50 text-2xl">
                            {article.bnTitle}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between border-y border-primary/10 py-6 mb-8 gap-4">
                            <Author
                                name={article?.author?.name}
                                title={article?.author?.title}
                                src={article?.author?.src}
                                publishedAt={article?.createdAt}
                                location={article?.author?.location}
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-nowrap text-xl">Share:</span>
                                <CopyFacebookCaption article={article} />
                                <ShareFacebook />
                            </div>
                        </div>

                        <figure className="mb-8">
                            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-200">
                                <Image
                                    fill
                                    alt={article.bnTitle}
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
                <Aside articles={articles} />
            </MainLayout>

            {related?.length > 0 && (
                <section className="mt-20">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <Activity className="text-primary" />
                        সম্পর্কিত খবর
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 grid-cols-1">
                        {related.map(a => <ArticleCard key={a._id} props={a} />)}
                    </div>
                </section>
            )}
        </main>
    )
}

export default Page