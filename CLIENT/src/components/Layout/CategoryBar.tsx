import { Category } from "@/lib/type";
import { getAllCategories } from "@/lib/useApi/api";
import Link from "next/link";

interface CategoryNavLinks {
    label: string;
    href: string;
}

interface CategoryBarProps {
    categories?: Category[];
}

export const CategoryBar = async ({ categories: initialCategories }: CategoryBarProps = {}) => {
    // fetch categories from API if not passed
    const categories = initialCategories || (await getAllCategories());

    const navlinks: CategoryNavLinks[] = [
        { label: 'হোম', href: '/' },
        { label: 'সব সংবাদ', href: '/news' },
        ...categories.map(cat => ({
            label: cat.nameBN, // show Bangla name
            href: `/category/${cat.nameEN.toLowerCase().replace(/\s+/g, '-')}`
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
                            <span className='hover:bg-primary/20 px-3 py-1 mx-2.5 text-nowrap text-center transition-colors'>
                                {cat.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};