import { articles } from '@/lib/newses'
import { formatNumber } from '@/lib/utils'
import { BellRing, ChartNoAxesCombined } from 'lucide-react'
import Link from 'next/link'

export const Aside = () => {
    return (
        <aside className="lg:col-span-4 py-6 mb-10 flex flex-col gap-y-4">
            {/* recent News  */}
            <div className="bg-neutral-subtle dark:bg-primary/5 p-6 rounded-xl border border-neutral-muted dark:border-primary/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2"><BellRing className="text-primary" />সাম্প্রতিক খবর</h3>
                </div>
                <ul className="space-y-4">
                    {articles?.reverse().slice(0, 3).map((article) => (
                        <li key={article?.id} className="border-b border-neutral-muted dark:border-primary/10 pb-4 last:border-0 last:pb-0">
                            <Link className="group" href={`news/${article.slug}`}>
                                <span className="text-xs text-primary font-bold block mb-1">{article?.categoryBN}</span>
                                <p className="text-base font-medium group-hover:text-primary transition-colors">{article?.title}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Ad Section */}
            <div className="bg-slate-100 dark:bg-slate-800 h-64 rounded-xl flex items-center justify-center border border-dashed border-slate-300">
                <span className="text-slate-400 text-sm">বিজ্ঞাপন</span>
            </div>
            {/* Popular News || Most Read  */}
            <div className="">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><ChartNoAxesCombined className="text-primary" />জনপ্রিয় সংবাদ</h3>
                <div className="space-y-6">
                    {articles?.reverse().slice(0, 5).map((article, index) => (
                        <div key={article?.id} className="flex gap-4 items-start">
                            <span className="text-4xl font-bold text-neutral-muted dark:text-primary/20 leading-none">{formatNumber(index + 1)}</span>
                            <Link href={`news/${article.slug}`} className="font-bold hover:text-primary cursor-pointer transition-colors">{article?.title}</Link>
                        </div>
                    ))}
                </div>
            </div>
            {/* Newsletter  */}
            {/* <div className="bg-primary text-white p-6 rounded-xl">
            <span className="material-symbols-outlined text-4xl mb-4">mail</span>
            <h3 className="text-xl font-bold mb-2 font-display">সংবাদপত্র পান সরাসরি ইমেইলে</h3>
            <p className="text-primary-foreground/80 text-sm mb-4">প্রতিদিনের বাছাইকৃত সেরা খবরগুলো পেতে সাবস্ক্রাইব করুন।</p>
            <div className="space-y-2">
              <input
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="আপনার ইমেইল" type="email" />
              <button
                className="w-full bg-white text-primary font-bold py-2 rounded-lg hover:bg-neutral-subtle transition-colors">সাবস্ক্রাইব
                করুন</button>
            </div>
          </div> */}
        </aside>
    )
}
