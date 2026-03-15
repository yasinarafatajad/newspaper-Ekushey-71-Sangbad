// /app/news/[slug]/page.tsx
import { Aside } from "@/components/Layout/Aside"
import { MainLayout } from "@/components/Layout/MainLayout"
import { ArticleCard } from "@/components/ui/ArticleCard"
import Image from "next/image"
import Link from "next/link"
import { Author } from "@/components/ui/Author"
import { Article } from "@/lib/type"
import { Activity, Share2 } from "lucide-react"
import ShareFacebook from "@/components/ui/ShareFacebook"
import CopyFacebookCaption from "@/components/ui/CopyFacebookCaption"
import { api } from "@/lib/useApi/api"
import ShareMessenger from "@/components/ui/ShareMessenger"
import type { Metadata } from "next";
import ShareWhatsApp from "@/components/ui/ShareWhatsApp"

interface PageProps {
    params: {
        slug: string
    }
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const news = await getNews(slug);

    if (!news) {
        return {
            title: "সংবাদ পাওয়া যায়নি",
        };
    }

    const newsUrl = `https://ekushey71sangbad.vercel.app/news/${params.slug}`;

    return {
        title: news.bnTitle,
        description: "📢 গুরুত্বপূর্ণ এই সংবাদটি এখনই পড়ুন। বিস্তারিত জানতে ক্লিক করুন।",

        alternates: {
            canonical: newsUrl,
        },

        openGraph: {
            title: news.bnTitle,
            description: "📢 গুরুত্বপূর্ণ এই সংবাদটি এখনই পড়ুন। বিস্তারিত জানতে ক্লিক করুন।",
            url: newsUrl,
            type: "article",
            publishedTime: news.createdAt,
            authors: [news.author?.name],
            images: [
                {
                    url: news.featuredImage,
                    width: 1200,
                    height: 630,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: news.bnTitle,
            description: "📢 গুরুত্বপূর্ণ এই সংবাদটি এখনই পড়ুন। বিস্তারিত জানতে ক্লিক করুন।",
            images: [news.featuredImage],
        },
    };
}


// fetch all articles
const getAllNews = async (): Promise<Article[]> => {
    try {
        const res = await fetch(`${api}/AllNews`);

        if (!res.ok) {
            throw new Error("Failed to fetch news");
        }

        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}
// fetch current article
const getNews = async (slug: string): Promise<Article | null> => {
    try {
        const res = await fetch(`${api}/news/${slug}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) return null;

        return res.json();
    } catch {
        return null;
    }
};

const Page = async ({ params }: PageProps) => {
    const { slug } = await params;

    // fetch all articles
    const articles = await getAllNews();
    // fetch current article
    const article = await getNews(slug);

    if (!article) {
        return (
            <main className="py-8">
                <h1 className="text-3xl font-bold">Article not found</h1>
            </main>
        )
    }

    // Related articles (same category, without current article)
    const related: Article[] = articles.filter(
        a => a.categoryEN === article.categoryEN && a.slug !== slug
    )

    return (
        <main className="py-3">
            <MainLayout>
                <main className="lg:col-span-8">
                    {/* Breadcrumb */}
                    <div className="flex items-start gap-2 text-sm text-slate-500 mb-3">
                        <Link className="hover:text-primary" href="/">হোম</Link>
                        <span className="material-symbols-outlined text-xs">/</span>
                        <Link className="hover:text-primary" href={`/category/${article.categoryEN}`}>
                            {article.categoryBN}
                        </Link>
                        <span className="material-symbols-outlined text-xs">/</span>
                        <span className="text-primary font-medium">{article.bnTitle}</span>
                    </div>

                    {/* article */}
                    <article>
                        <h1 className="md:text-5xl font-bold leading-tight mb-3 text-slate-900 text-2xl">
                            {article.bnTitle}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between border-y border-primary/10 py-2 mb-3 gap-4">
                            <Author
                                name={article?.author?.name}
                                title={article?.author?.title}
                                src={article?.author?.src}
                                publishedAt={article?.createdAt}
                                location={article?.author?.location}
                            />
                        </div>

                        <figure className="mb-3">
                            <div className="relative overflow-hidden aspect-video">
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

                        <div className="serif-font md:text-xl leading-relaxed text-slate-800 text-base">
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
                        <div className="flex items-center gap-2">
                            {/* <span className="text-nowrap text-xl">Share:</span> */}
                            <Share2 />
                            <CopyFacebookCaption article={article} />
                            <ShareFacebook />
                            <ShareMessenger />
                            <ShareWhatsApp message={`📢 গুরুত্বপূর্ণ খবর: ${article.bnTitle}`} />
                        </div>
                        {/* share instruction */}
                        <figcaption className="text-sm text-slate-500 italic border-l-2 border-primary pl-2 mt-4">
                            সহজে শেয়ার করতে প্রথমে <span className="font-bold">কপি করুন</span>, তারপর Facebook বাটনে ক্লিক করে <span className="font-bold"> পেস্ট করুন।</span>
                        </figcaption>
                    </article>
                </main>
                <Aside articles={articles} />
            </MainLayout>

            {related?.length > 0 && (
                <section className="container mt-20">
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