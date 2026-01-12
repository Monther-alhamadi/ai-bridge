import { Newspaper, Zap, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";

interface NewsPulseProps {
  locale: "en" | "ar";
}

// Simulating latest headline
const LATEST_NEWS = {
  en: "OpenAI launches o1 model with human-like reasoning capabilities.",
  ar: "إطلاق نموذج o1 من OpenAI بقدرات تفكير منطقي تحاكي البشر."
};

export function NewsPulse({ locale }: NewsPulseProps) {
  return (
    <div className="relative group">
       {/* Background Glow */}
       <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
       
       <div className="relative rounded-2xl border bg-card/50 backdrop-blur-md p-4 shadow-sm flex flex-col md:flex-row items-center gap-4 transition-all group-hover:bg-card">
          <div className="flex items-center gap-3 shrink-0">
             <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <div className="relative h-10 w-10 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                   <TrendingUp className="h-5 w-5" />
                </div>
             </div>
             <div>
                <Badge variant="outline" className="text-[10px] uppercase font-black border-primary/30 text-primary">
                   AI Pulse
                </Badge>
                <div className="text-[10px] text-muted-foreground font-bold">UPDATED 1M AGO</div>
             </div>
          </div>

          <div className="flex-grow text-center md:text-start">
             <p className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">
                {LATEST_NEWS[locale]}
             </p>
          </div>

          <Link 
            href={`/${locale}/news`}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-2 text-xs font-black text-primary hover:bg-primary hover:text-primary-foreground transition-all group/link"
          >
             {locale === "en" ? "Live Newsroom" : "غرفة الأخبار المباشرة"}
             <ArrowRight className={`h-3 w-3 transition-transform group-hover/link:translate-x-1 ${locale === 'ar' ? 'rotate-180' : ''}`} />
          </Link>
       </div>
    </div>
  );
}
