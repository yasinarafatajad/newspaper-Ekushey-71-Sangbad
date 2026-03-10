"use client"
import { articles } from "@/lib/newses";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
    label: string;
    href: string;
};



export const CategoryBar = () => {
    const pathname = usePathname();
    const [uniqueCategoriesEN, setUniqueCategoriesEN] = useState<string[]>([])
    const [uniqueCategoriesBN, setUniqueCategoriesBN] = useState<string[]>([])

    // fetch categories
    useEffect(() => {
        if (articles.length > 0) {
            const categoriesEN = Array.from(new Set(articles.map(a => a.categoryEN)));
            const categoriesBN = Array.from(new Set(articles.map(a => a.categoryBN)));
            setUniqueCategoriesEN(categoriesEN);
            setUniqueCategoriesBN(categoriesBN);
        }
    }, [articles]);

    const navlinks: Category[] = [
        { label: 'Home', href: '/' },
        ...uniqueCategoriesEN?.map((catEN, index) => ({
            label: uniqueCategoriesBN[index],
            href: `/category/${catEN.toLowerCase().replace(/\s+/g, '-')}`
        }))
    ];

    return (
        <div className="hidden lg:block bg-background-light sticky top-0 backdrop-blur-2xl z-50 border-b border-neutral-muted">
            <div className="container overflow-x-auto">
                <nav className="flex items-center justify-start flex-wrap gap-y-3 whitespace-nowrap text-sm md:text-base font-medium py-2 backdrop-blur-sm">
                    {navlinks.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={cat.href}
                            className={`${idx === navlinks.length - 1 ? 'border-r-0' : 'border-r'}`}
                        >
                            <span className={`hover:bg-primary/20 px-3 py-1 mx-2.5 text-nowrap text-center transition-colors ${pathname === cat.href ? "border-b-2 border-primary" : ""}`} >{cat.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};
