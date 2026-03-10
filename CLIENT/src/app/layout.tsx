import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import { Header } from '@/components/Layout/Header'
import { Footer } from "@/components/Layout/Footer";
import { CategoryBar } from "@/components/Layout/CategoryBar";
import { TitleBar } from "@/components/Layout/TitleBar";
import ScrollToTop from "@/components/Layout/ScrollToTop";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <Header />
        <TitleBar />
        <CategoryBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
