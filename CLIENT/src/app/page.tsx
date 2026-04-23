import { Aside } from "@/components/Layout/Aside";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Category } from "@/components/Sections/Home/Category";
import { Hero } from "@/components/Sections/Home/Hero";
import { Lifestyle } from "@/components/Sections/Home/Lifestyle";
import { Article } from "@/lib/type";
import { api } from "@/lib/useApi/api";
import { Metadata } from "next";
import logo from '@/assets/logoDark.png';

export async function generateMetadata(): Promise<Metadata> {
  const siteName = "একুশে ৭১ সংবাদ";
  const siteUrl = "https://ekushey71sangbad.vercel.app";

  return {
    title: siteName,
    description: "বাংলাদেশের সর্বশেষ খবর, রাজনীতি, অর্থনীতি, অপরাধ, লাইফস্টাইল এবং আরও অনেক গুরুত্বপূর্ণ খবর এখানে পড়ুন।",

    // Canonical URL
    alternates: {
      canonical: siteUrl,
    },

    // Open Graph (Facebook, Messenger, LinkedIn)
    openGraph: {
      title: siteName,
      description: "বাংলাদেশের সর্বশেষ খবর, রাজনীতি, অর্থনীতি, অপরাধ, লাইফস্টাইল এবং আরও অনেক গুরুত্বপূর্ণ খবর এখানে পড়ুন।",
      url: siteUrl,
      type: "website",
      images: [
        {
          url: logo.src, // Next.js Image import
          width: 307,    // তোমার logo এর width
          height: 64,    // তোমার logo এর height
          alt: siteName,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: "বাংলাদেশের সর্বশেষ খবর, রাজনীতি, অর্থনীতি, অপরাধ, লাইফস্টাইল এবং আরও অনেক গুরুত্বপূর্ণ খবর এখানে পড়ুন।",
      images: [
        {
          url: logo.src,
          width: 307,
          height: 64,
        },
      ],
    },

    // Optional: Robots
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
          {news.length > 0 &&(
            <>
            <Hero latest={news[news.length - 1]} />
            <Hero latest={news[news.length - 2]} />
            </> 
          )}
          {/* ad section */}
          {/* <div className="hidden lg:grid place-content-center mb-2 bg-slate-100 h-50 w-full rounded-xl border border-dashed border-slate-300 mt-6">
            <span className="text-slate-400 text-sm self-middle">বিজ্ঞাপন</span>
          </div> */}
        </main>

        {/* right */}
        <Aside articles={news} />
      </MainLayout>

      <Category categories={groupedArticles} />
      <Lifestyle articles={news} />
    </>
  );
}
