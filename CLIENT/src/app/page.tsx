import { MainLayout } from "@/components/Layout/MainLayout";
import { Category } from "@/components/Sections/Home/Category";
import { Hero } from "@/components/Sections/Home/Hero";
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
        <main className="lg:col-span-8">
          <Hero />
          <Category />
        </main>

        {/* right */}
        <aside className="lg:col-span-4 space-y-10 mt-10 lg:mt-0 bg-amber-500">
          side
        </aside>
      </MainLayout>
    </>
  );
}
