"use client"
import { formatDate, formatDay } from "@/lib/utils";
import { Logs, Search, X } from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from '@/assets/logoLight.png'

type NavLinks = { label: string; href: string }
const navLinks: NavLinks[] = [
    { label: 'Home', href: '/' },
    { label: 'রাজনীতি', href: 'category/politics' },
    { label: 'আন্তর্জাতিক', href: 'category/international' },
    { label: 'অর্থনীতি', href: 'category/economy' },
    { label: 'খেলাধুলা', href: 'category/sports' },
    { label: 'বিনোদন', href: 'category/entertainment' },
    { label: 'বিজ্ঞান ও প্রযুক্তি', href: 'category/science-technology' },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const today: string = new Date().toISOString();
  return (
    <header className="border-b border-neutral-muted bg-background-light">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo  */}
          <div className="flex items-center gap-3">
            <Link href={'/'}>
              <Image
                src={logo}
                alt="Ekushey 71 Sangbad"
                width={307}
                height={64}
                loading="lazy"
                className="h-16 lg:h-20 w-auto pointer-events-none"
              />
            </Link>
          </div>
          {/* Right Actions  */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs text-slate-500 uppercase">{formatDay(today)}</span>
              <span className="text-sm font-bold">{formatDate(today)} খ্রিষ্টাব্দ</span>
            </div>
            {/* <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search /></span>
              <input className="pl-10 pr-4 py-2 bg-neutral-subtle border-none rounded-full text-sm focus:ring-2 focus:ring-primary w-40 lg:w-60 transition-all" placeholder="অনুসন্ধান করুন..." type="text" />
            </div> */}
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-neutral-subtle flex items-center justify-center">
              <Logs />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation  */}
      <div className={`fixed inset-0 z-60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        {/* Sliding menu */}
        <div className={`absolute top-0 left-0 h-full w-4/5 bg-background-light shadow-2xl p-6 transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-primary font-display">মেনু</h2>
            <button className="p-2" onClick={() => setMobileOpen(false)}>
              <X />
            </button>
          </div>
          <div className="flex flex-col border-b mb-2 text-right">
              <span className="text-xs text-slate-500 uppercase">{formatDay(today)}</span>
              <span className="text-sm font-bold">{formatDate(today)} খ্রিষ্টাব্দ</span>
            </div>
          {/* <div className="relative w-full mb-2.5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search /></span>
            <input className="pl-10 pr-4 py-2 w-full bg-neutral-subtle border-none rounded-md text-sm transition-all" placeholder="অনুসন্ধান করুন..." type="text" />
          </div> */}
          <nav className="flex flex-col gap-4 text-lg font-medium">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={()=>setMobileOpen(false)}
                className={`py-2 border-b border-neutral-muted ${idx === navLinks.length - 1 ? "border-b-0" : ""
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
