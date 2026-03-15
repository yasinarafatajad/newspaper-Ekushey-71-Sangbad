import Link from 'next/link'
import logo from '@/assets/logoDark.png'
import Image from 'next/image';
import { formatNumber } from '@/lib/utils';
import { api } from '@/lib/useApi/api';
import { Category } from '@/lib/type';

type SubNavLink = {
    label: string;
    href: string;
};
interface FooterNavLinks {
    label: string;
    href: string;
};

const footerLinks: SubNavLink[] = [
    { label: "শর্তাবলী", href: "/terms" },
    { label: "কুকি পলিসি", href: "/cookie-policy" },
];

// fetch all categories
const getAllCategories = async (): Promise<Category[]> => {
    try {
        const res = await fetch(`${api}/AllCategory`);
        if (!res.ok) throw new Error("Failed to fetch categories");

        const json = await res.json();
        return json.data; // <-- extract the array from {count, data}
    } catch (error) {
        console.error(error);
        return [];
    }
}

const currentYear = formatNumber(new Date().getFullYear());

export const Footer = async () => {
    // fetch categories from API
    const categories = await getAllCategories();

    const subNavLinks: FooterNavLinks[] = [
        ...categories.map(cat => ({
            label: cat.nameBN, // show Bangla name
            href: `/category/${cat.nameEN.toLowerCase().replace(/\s+/g, '-')}`
        }))
    ];
    return (
        <footer className="bg-background-dark text-slate-300 pt-8 pb-16 mt-20 border-t border-primary/20">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12  mb-12">
                    {/* branding */}
                    <div className="col-span-1 ">
                        {/* Logo  */}
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
                            <Link href={'/'}>
                                <Image src={logo} alt="Ekushey 71 Sangbad" loading="lazy" height={64} width={307} className='h-16 lg:h-20 w-auto pointer-events-none' />
                            </Link>
                        </div>
                        <p className="text-sm leading-relaxed text-center lg:text-left mb-6">
                            খবর যা সত্যের সঙ্গে দাঁড়ায় — একুশে ৭১ সংবাদ। আপডেট, বিশ্লেষণ আর দ্রুত সংবাদ সব এক জায়গায়। আপনার বিশ্বাসযোগ্য সংবাদ সঙ্গী — সবসময় একুশে ৭১ সংবাদ এ
                        </p>
                    </div>
                    {/* <div className="hidden lg:block col-span-1" /> */}
                    <div className='grid grid-cols-1 lg:col-span-1 gap-12 text-center lg:text-right'>
                        {/* category */}
                        <div className='col-span-1'>
                            <h4 className="text-white font-bold mb-6">বিভাগসমূহ</h4>
                            <ul className="space-y-3 text-sm">
                                {subNavLinks.map((link, idx) => (
                                    <li key={idx}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* info */}
                        {/* <div className='col-span-1'>
                            <h4 className="text-white font-bold mb-6">তথ্য</h4>
                            <ul className="space-y-3 text-sm">
                                {infoLinks.map((link, idx) => (
                                    <li key={idx}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div> */}

                    </div>
                    {/* app download */}
                    {/* <div>
                        <h4 className="text-white font-bold mb-6">অ্যাপ ডাউনলোড করুন</h4>
                        <p className="text-sm mb-4">আমাদের মোবাইল অ্যাপ ডাউনলোড করে আরও সহজে আপডেট থাকুন।</p>
                        <div className="space-y-3">
                            <div className="bg-neutral-muted/10 border border-neutral-muted/20 px-4 py-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-neutral-muted/20">
                                <span className="material-symbols-outlined">android</span>
                                <div>
                                    <p className="text-[10px] leading-none uppercase opacity-60">Get it on</p>
                                    <p className="text-sm font-bold leading-none">Google Play</p>
                                </div>
                            </div>
                            <div className="bg-neutral-muted/10 border border-neutral-muted/20 px-4 py-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-neutral-muted/20">
                                <span className="material-symbols-outlined">ios</span>
                                <div>
                                    <p className="text-[10px] leading-none uppercase opacity-60">Download on the</p>
                                    <p className="text-sm font-bold leading-none">App Store</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
                {/* copyright bar */}
                <div className="border-t border-neutral-muted/10 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>&copy; {currentYear} | Ekushey 71 Sangbad | সর্বস্বত্ব সংরক্ষিত।</p>
                    <div className="flex items-center justify-center gap-6 flex-wrap">
                        {footerLinks.map((link, id) => (
                            <Link key={id} href={link.href} className="hover:text-white transition-colors text-nowrap">{link.label}</Link>
                        ))}
                    </div>
                </div>
                {/* credit bar */}
                <div className="border-t border-neutral-muted/10 pt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-xs">
                    <p>Developed by <Link href={'https://ajad.pro.bd'} target='_blank' className='text-primary font-bold'>Yasin Arafat Ajad</Link></p>
                </div>
            </div>
        </footer>
    )
}
