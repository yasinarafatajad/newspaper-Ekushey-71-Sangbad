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
import { api } from "@/lib/useApi/api";

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
  title: {
    default: "একুশে ৭১ সংবাদ",
    template: "%s | একুশে ৭১ সংবাদ",
  },
  description:
    "বাংলাদেশের সর্বশেষ খবর, রাজনীতি, অর্থনীতি, অপরাধ, লাইফস্টাইলসহ সব খবর পড়ুন একুশে ৭১ সংবাদে।",

  metadataBase: new URL("https://ekushey71sangbad.vercel.app"),

  openGraph: {
    siteName: "একুশে ৭১ সংবাদ",
    type: "website",
    locale: "bn_BD",
  },

  verification: {
    google: "zM88wOzTVkD5ZWHiOEjquywBRnz9UF0ZMRjqbaB9qmc",
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

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
        <Header/>
        <TitleBar articles={news}/>
        <CategoryBar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
