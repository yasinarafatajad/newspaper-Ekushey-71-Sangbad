import { Zap } from 'lucide-react'
import React from 'react'

const headlines: string[] = [
    'রাজধানীতে ভারী বৃষ্টির সম্ভাবনা, জনজীবনে স্বস্তি',
    'শেয়ার বাজারে সূচকের উর্ধ্বগতি, বিনিয়োগকারীদের মুখে হাসি',
    'টি-টোয়েন্টি বিশ্বকাপের প্রস্তুতি ম্যাচে সহজ জয় বাংলাদেশের',
];

export const TitleBar = () => {
    return (
        <div className="bg-neutral-subtle dark:bg-primary/5 py-2 border-b border-neutral-muted dark:border-primary/10">
            <div className="container flex items-center overflow-hidden">
                <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded mr-4 shrink-0 flex items-center gap-1 z-30">
                    <Zap /> ব্রেকিং নিউজ
                </div>
                <div className="z-20 overflow-hidden border-l-3 py-1.5 border-primary/40 w-full">
                    <div className="flex items-center animate-marquee lg:animate-marquee-lg">
                        {headlines.map((title, idx) => (
                            <p key={idx} className={`text-sm font-medium whitespace-nowrap px-2 flex items-center gap-1.5 `}>
                                <span className="bg-primary p-1 rounded-full" />
                                <span>
                                    {title}
                                </span>
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
