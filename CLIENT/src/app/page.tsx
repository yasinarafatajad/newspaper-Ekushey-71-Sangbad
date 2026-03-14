import { Aside } from "@/components/Layout/Aside";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Category } from "@/components/Sections/Home/Category";
import { Hero } from "@/components/Sections/Home/Hero";
import { Lifestyle } from "@/components/Sections/Home/Lifestyle";
import { Article } from "@/lib/type";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekushey 71 Sangbad",
  description: "All News",
};

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

export default async function Home() {
  const news = await getAllNews();

  const groupedArticles: Record<string, Article[]> = news.reduce(
    (acc, article) => {
      const category = article.categoryBN;
      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(article);

      return acc;
    },
    {} as Record<string, Article[]>
  );

  return (
    <>
      <MainLayout>
        {/* left */}
        <main className="lg:col-span-8">
          {news.length > 0 &&
            <Hero latest={news[news.length - 1]} />
          }
          {/* ad section */}
          <div className="hidden lg:grid place-content-center mb-2 bg-slate-100 h-50 w-full rounded-xl border border-dashed border-slate-300">
            <span className="text-slate-400 text-sm self-middle">বিজ্ঞাপন</span>
          </div>
        </main>

        {/* right */}
        <Aside articles={news} />
      </MainLayout>

      <Category categories={groupedArticles} />
      <Lifestyle articles={news} />
    </>
  );
}
