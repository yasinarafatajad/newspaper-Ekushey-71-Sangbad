import { Aside } from "@/components/Layout/Aside";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Category } from "@/components/Sections/Home/Category";
import { Hero } from "@/components/Sections/Home/Hero";
import { Lifestyle } from "@/components/Sections/Home/Lifestyle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ekushey 71 Sangbad",
  description: "All News",
};

export default function Home() {
  return (
    <>
      <MainLayout>
        {/* left */}
        {/* reUsable children props */}
        <main className="lg:col-span-8">
          <Hero />
          {/* ad section */}
          <div className="hidden lg:grid place-content-center mb-2 bg-slate-100 h-50 w-full rounded-xl border border-dashed border-slate-300">
            <span className="text-slate-400 text-sm self-middle">বিজ্ঞাপন</span>
          </div>
        </main>

        {/* right */}
        <Aside />
      </MainLayout>

      <Category />
      <Lifestyle />
    </>
  );
}
