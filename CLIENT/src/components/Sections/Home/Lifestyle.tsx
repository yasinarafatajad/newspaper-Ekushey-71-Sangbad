import { ArticleCard } from "@/components/ui/ArticleCard"
import { Article } from "@/lib/type";
import { Gamepad2 } from "lucide-react";
// import { articles } from "@/lib/newses"

interface AsideProps {
    articles: Article[];
}
export const Lifestyle = ({ articles }: AsideProps) => {
    const lifeS = articles?.filter(e => e.categoryEN.toLocaleLowerCase() === 'sports')

    return (
        <>
            {lifeS.length > 0 && (
                <section className="container mt-16 border-t border-neutral-muted pt-10">
                    <h3 className="text-2xl font-bold flex items-center gap-2 mb-8"><Gamepad2 className="text-primary" />খেলাধুলা</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {lifeS?.reverse().slice(0, 8).map((e) => (
                            <ArticleCard key={e._id} props={e} />
                        ))}
                    </div>
                </section>
            )}
        </>
    )
}
