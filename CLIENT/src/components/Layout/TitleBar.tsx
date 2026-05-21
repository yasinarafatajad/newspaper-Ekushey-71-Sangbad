import { Article } from '@/lib/type';
import { Zap } from 'lucide-react'

interface TitleBarProps {
    articles: Article[];
}

export const TitleBar = ({articles} : TitleBarProps) => {
    
    return (
        <div className="bg-green-300 py-2 border-b border-neutral-muted">
            <div className="container flex items-center overflow-hidden">
                <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded mr-1 shrink-0 flex items-center gap-1 z-30">
                    <Zap /> ব্রেকিং নিউজ
                </div>
                <div className="z-20 overflow-hidden border-l-3 py-1.5 border-primary/40 w-full">
                    <div className="flex items-center animate-marquee lg:animate-marquee-lg">
                        {[...(articles || [])].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).map((article, idx) => (
                            <p key={idx} className={`text-sm font-medium whitespace-nowrap px-2 flex items-center gap-1.5 `}>
                                <span className="bg-primary p-1 rounded-full" />
                                <span>
                                    {article.bnTitle}
                                </span>
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
