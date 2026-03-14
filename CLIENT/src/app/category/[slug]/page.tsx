import { ArticleGrid } from "@/components/ui/ArticleGrid";
import { Article } from "@/lib/type";
import { api } from "@/lib/useApi/api";
import Link from "next/link";

interface PageProps {
    params: {
        slug: string;
    };
}

const Page = async (props: PageProps) => {
    const { slug } = await props.params;

    // fetch articles
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
    const articles = await getAllNews();

    // Filter articles by category
    const categoryArticle: Article[] = articles.filter(
        e => e?.categoryEN?.toLowerCase() === slug?.toLowerCase()
    );

    if (!categoryArticle)
        return 'no article here'

    return (
        <main className="container py-8">
            <h1 className="text-3xl font-bold mb-6 uppercase">{slug}</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                {categoryArticle?.map(news => (
                    <Link key={news._id} href={`/news/${news.slug}`}>
                        <ArticleGrid article={news} />
                    </Link>
                ))}
            </div>
        </main>
    );
};

export default Page;