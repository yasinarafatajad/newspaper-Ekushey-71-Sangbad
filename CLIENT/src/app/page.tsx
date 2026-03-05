import { MainLayout } from "@/components/Layout/MainLayout";
import { Category } from "@/components/Sections/Home/Category";
import { Hero } from "@/components/Sections/Home/Hero";
import { articles } from "@/lib/newses";
import { Metadata } from "next";
import { formatNumber } from '../lib/utils';

export const metadata: Metadata = {
  title: "Ekushey 71 Sangbad",
  description: "All News",
};

export default function Home() {
  console.log(articles);

  return (
    <>
      <MainLayout>
        {/* left */}
        <main className="lg:col-span-8">
          <Hero />
          <Category />
        </main>

        {/* right */}
        <aside className="lg:col-span-4 space-y-10 mt-10 lg:mt-0 py-6 mb-10">
          {/* Latest News  */}
          <div className="bg-neutral-subtle dark:bg-primary/5 p-6 rounded-xl border border-neutral-muted dark:border-primary/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">সাম্প্রতিক খবর</h3>
            </div>
            <ul className="space-y-4">
              {articles?.reverse().slice(0, 3).map((article) => (
                <li key={article?.id} className="border-b border-neutral-muted dark:border-primary/10 pb-4 last:border-0 last:pb-0">
                  <a className="group" href="#">
                    <span className="text-xs text-primary font-bold block mb-1">{article?.category}</span>
                    <p className="text-base font-medium group-hover:text-primary transition-colors">{article?.title}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Most Read  */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">জনপ্রিয় সংবাদ</h3>
            <div className="space-y-6">
              {articles?.map((article, index) => (
                <div key={article?.id} className="flex gap-4 items-start">
                  <span className="text-4xl font-bold text-neutral-muted dark:text-primary/20 leading-none">{formatNumber(index + 1)}</span>
                  <p className="font-bold hover:text-primary cursor-pointer transition-colors">{article?.title}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Newsletter  */}
          {/* <div className="bg-primary text-white p-6 rounded-xl">
            <span className="material-symbols-outlined text-4xl mb-4">mail</span>
            <h3 className="text-xl font-bold mb-2 font-display">সংবাদপত্র পান সরাসরি ইমেইলে</h3>
            <p className="text-primary-foreground/80 text-sm mb-4">প্রতিদিনের বাছাইকৃত সেরা খবরগুলো পেতে সাবস্ক্রাইব করুন।</p>
            <div className="space-y-2">
              <input
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="আপনার ইমেইল" type="email" />
              <button
                className="w-full bg-white text-primary font-bold py-2 rounded-lg hover:bg-neutral-subtle transition-colors">সাবস্ক্রাইব
                করুন</button>
            </div>
          </div> */}
        </aside>
      </MainLayout>
    </>
  );
}
