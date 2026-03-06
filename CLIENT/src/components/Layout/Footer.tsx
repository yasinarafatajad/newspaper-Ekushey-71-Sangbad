import Link from 'next/link'
import logo from '@/assets/logoDark.png'
import Image from 'next/image';

type SubNavLink = {
    label: string;
    href: string;
};
// type CONTACT = {
//     label: string;
//     href?: string;
// };

const subNavLinks: SubNavLink[] = [
    { label: 'রাজনীতি', href: '/politics' },
    { label: 'আন্তর্জাতিক', href: '/international' },
    { label: 'খেলাধুলা', href: '/sports' },
    { label: 'বিজ্ঞান ও প্রযুক্তি', href: '/science-technology' },
];

const infoLinks: SubNavLink[] = [
    { label: 'আমাদের সম্পর্কে', href: '/about' },
    { label: 'যোগাযোগ', href: '/contact' },
    { label: 'গোপনীয়তা নীতি', href: '/privacy-policy' },
    { label: 'বিজ্ঞাপন', href: '/advertise' },
];

const footerLinks: SubNavLink[] = [
    { label: "শর্তাবলী", href: "/terms" },
    { label: "কুকি পলিসি", href: "/cookie-policy" },
];
// const contactLinks: CONTACT[] = [
//     { label: 'ইমেইল: selim@gmail.com', href: 'mailto:selim@gmail.com' },
//     { label: 'ফোন: +880123456789', href: 'tel:+880123456789' },
//     { label: 'ঠিকানা: খালিয়াজুড়ি, নেত্রকোণা' },
// ];

// Convert English digits to Bangla digits
const toBanglaNumber = (num: number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
        .toString()
        .split("")
        .map(d => banglaDigits[parseInt(d)])
        .join("");
};

const currentYear = toBanglaNumber(new Date().getFullYear());

export const Footer = () => {
    return (
        <footer className="bg-background-dark text-slate-300 pt-8 pb-16 mt-20 border-t border-primary/20">
            <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                    {/* branding */}
                    <div className="col-span-1 md:col-span-1 sm:col-span-2 lg:col-span-1">
                        {/* Logo  */}
                        <div className="flex items-center gap-3 mb-5">
                            <Link href={'/'}>
                                <Image src={logo} alt="Ekushey 71 Sangbad" height={64} width={307} className='h-16 lg:h-20 w-auto' />
                            </Link>
                        </div>
                        <p className="text-sm leading-relaxed mb-6">
                            সবার আগে সঠিক ও বস্তুনিষ্ঠ সংবাদ পৌঁছে দিতে আমরা অঙ্গীকারবদ্ধ। আমাদের সাথেই থাকুন।
                        </p>
                    </div>
                    {/* category */}
                    <div>
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
                    <div>
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
                    </div>
                    {/* contact */}
                    {/* <div>
                        <h4 className="text-white font-bold mb-6">যোগাযোগ</h4>
                        <ul className="space-y-3 text-sm">
                            {contactLinks.map((link, idx) => (
                                <li key={idx}>
                                    {link.href ? (
                                        <Link
                                            href={link.href}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <span>{link.label}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div> */}
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
                    <p>&copy; {currentYear} বাংলা নিউজ। সর্বস্বত্ব সংরক্ষিত।</p>
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
