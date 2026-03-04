import Link from "next/link";

type Category = {
    label: string;
    href: string;
};

const categories: Category[] = [
    { label: 'রাজনীতি', href: '/politics' },
    { label: 'আন্তর্জাতিক', href: '/international' },
    { label: 'অর্থনীতি', href: '/economy' },
    { label: 'খেলাধুলা', href: '/sports' },
    { label: 'বিনোদন', href: '/entertainment' },
    { label: 'বিজ্ঞান ও প্রযুক্তি', href: '/science-technology' },
];

export const CategoryBar = () => {
    return (
        <div className="bg-background-light sticky top-0 backdrop-blur-2xl z-50 border-b border-neutral-muted">
            <div className="max-w-7xl mx-auto px-4 md:px-6 overflow-x-auto">
                <nav className="flex items-center justify-center flex-wrap whitespace-nowrap text-sm md:text-base font-medium py-2 backdrop-blur-sm">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={cat.href}
                            className={`${idx === categories.length - 1 ? 'border-r-0' : 'border-r'}`}
                        >
                            <span className="hover:bg-primary/20  px-3 py-1 mx-2.5 text-nowrap transition-colors">{cat.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};
