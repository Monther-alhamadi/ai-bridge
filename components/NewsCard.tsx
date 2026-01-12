"use client";

import { Star, ExternalLink, Zap, ArrowRight } from "lucide-react";
import { TrackedLink } from "@/components/TrackedLink";
import { Badge } from "@/components/Badge";
import { trackEvent } from "@/lib/analytics";

interface NewsCardProps {
  item: {
    id: string;
    title: { en: string; ar: string; };
    summary: { en: string; ar: string; };
    source: string;
    date: string;
    tag: string;
    score: number;
    link: string;
    tool_affiliate?: string;
  };
  locale: "en" | "ar";
}

export function NewsCard({ item, locale }: NewsCardProps) {
  return (
    <div className="group relative rounded-3xl border bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full bg-gradient-to-br from-card to-background">
      {/* Decorative Gradient Pulse */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

      {/* Top Meta */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold px-2 py-0">
             {item.tag}
          </Badge>
          <span className="text-[10px] text-muted-foreground font-medium">
            {new Date(item.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
          </span>
        </div>
        <div className="flex items-center gap-1 text-amber-500">
           <Star className="h-3 w-3 fill-current" />
           <span className="text-xs font-bold">{item.score.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 flex-grow">
        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
          {item.title[locale]}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {item.summary[locale]}
        </p>
      </div>

      {/* Footer / Actions */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Source: {item.source}
          </span>
          <TrackedLink 
            href={item.link}
            name={item.title[locale]}
            context="news_source"
            target="_blank"
            className="text-xs font-medium flex items-center gap-1 hover:text-primary transition-colors"
          >
            {locale === "en" ? "Read Original" : "المصدر الأصلي"}
            <ExternalLink className="h-3 w-3" />
          </TrackedLink>
        </div>

        {/* The Revenue Driver (Affiliate Link) */}
        {item.tool_affiliate && (
          <TrackedLink
            href={item.tool_affiliate}
            name={item.title[locale]}
            context="news_affiliate"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg hover:scale-[1.02] active:scale-95 transition-all group/btn"
          >
            <Zap className="h-4 w-4 fill-current group-hover:animate-pulse" />
            {locale === "en" ? "Try This AI Product" : "جرب هذا المنتج الذكي"}
            <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${locale === 'ar' ? 'rotate-180' : ''}`} />
          </TrackedLink>
        )}
      </div>
    </div>
  );
}
