"use client"
import { formatDate, formatDay } from "@/lib/utils";
import { Logs, X } from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from '@/assets/logoLight.png'
import { Category } from "@/lib/type";
import { api } from "@/lib/useApi/api";

type NavLinks = { label: string; href: string }

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const today: string = new Date().toISOString();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${api}/AllCategory`);
        const json = await res.json();
        setCategories(json.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const navlinks: NavLinks[] = [
    { label: 'হোম', href: '/' },
    { label: 'সব সংবাদ', href: '/news' },
    ...categories.map(cat => ({
      label: cat.nameBN, // show Bangla name
      href: `/category/${cat.nameEN.toLowerCase().replace(/\s+/g, '-')}`
    }))
  ];

  return (
    <header className="border-b border-neutral-muted bg-white">
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
              <span className="text-xs text-black uppercase">{formatDay(today)}</span>
              <span className="text-sm text-slate-700 font-bold">{formatDate(today)} খ্রিষ্টাব্দ</span>
            </div>
            {/* <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search /></span>
              <input className="pl-10 pr-4 py-2 bg-neutral-subtle border-none rounded-full text-sm focus:ring-2 focus:ring-primary w-40 lg:w-60 transition-all" placeholder="অনুসন্ধান করুন..." type="text" />
            </div> */}
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-text-main flex items-center justify-center">
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
        <div className={`absolute top-0 left-0 h-full w-4/5 bg-background-light shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
            {navlinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 border-b border-neutral-muted ${idx === navlinks.length - 1 ? "border-b-0" : ""
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
