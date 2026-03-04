import { MainLayout } from "@/components/Layout/MainLayout";
import { Hero } from "@/components/Sections/Home/Hero";

export default function Home() {
  return (
    <>
      <MainLayout>
        {/* left */}
        <main className="lg:col-span-8">
          <Hero />
        </main>

        {/* right */}
        <aside className="lg:col-span-4 space-y-10 mt-10 lg:mt-0 bg-amber-500">
          side
        </aside>
      </MainLayout>
    </>
  );
}
