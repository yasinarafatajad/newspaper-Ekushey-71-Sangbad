import { ArticleGrid } from "@/components/ui/ArticleGrid";
import { articles } from "@/lib/newses";
import { Article } from "@/lib/type";
import Link from "next/link";

interface PageProps {
    params: {
        slug: string;
    };
}

const Page = async (props: PageProps) => {
    // NO await here
    const { slug } = await props.params;

    // Filter articles by category
    const categoryArticle: Article[] = articles.filter(
        e => e?.categoryEN?.toLowerCase() === slug?.toLowerCase()
    );

    if (!categoryArticle)
        return 'no article here'

    return (
        <main className="container py-8">
            <h1 className="text-3xl font-bold mb-6">{slug}</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                {categoryArticle?.map(news => (
                    <Link key={news.id} href={`/news/${news.slug}`}>
                        <ArticleGrid article={news} />
                    </Link>
                ))}
            </div>
        </main>
    );
};

export default Page;