import * as React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import { Header } from '@/components/Layout/Header'
import { Footer } from "@/components/Layout/Footer";
import { CategoryBar } from "@/components/Layout/CategoryBar";
import { TitleBar } from "@/components/Layout/TitleBar";
import ScrollToTop from "@/components/Layout/ScrollToTop";
import { Article } from "@/lib/type";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifBengali = Noto_Serif_Bengali({
  weight: ['400', '700'],
  subsets: ['bengali'],
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  weight: ['400', '700'],
  subsets: ['bengali'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ekushey 71 Sangbad",
  description: "A NewsPaper",
  verification: {
    google: "zM88wOzTVkD5ZWHiOEjquywBRnz9UF0ZMRjqbaB9qmc"
  }
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const news = await getAllNews();


  return (
    <html lang="en"
      style={{
        '--font-display': notoSerifBengali.style.fontFamily,
        '--font-sans': notoSansBengali.style.fontFamily,
      } as React.CSSProperties}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollToTop />
        <Header articles={news}/>
        <TitleBar articles={news}/>
        <CategoryBar articles={news} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
