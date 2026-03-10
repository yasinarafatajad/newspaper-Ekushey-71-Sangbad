import { ArticleCard } from "@/components/ui/ArticleCard"
import { articles } from "@/lib/newses"

export const Lifestyle = () => {
    const lifeS = articles?.filter(e => e.categoryEN === 'Lifestyle')

    return (
        <section className="container mt-16 border-t border-neutral-muted pt-10">
            <h3 className="text-2xl font-bold mb-8">লাইফস্টাইল ও বিনোদন</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {lifeS?.reverse().slice(0, 8).map((e) => (
                    <ArticleCard key={e.id} props={e} />
                ))}
            </div>
        </section>
    )
}
