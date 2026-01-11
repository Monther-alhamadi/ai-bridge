import { aiNews } from "@/config/news";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { BrainCircuit, ExternalLink, Calendar, Palette, Zap, Box } from "lucide-react";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { StickyCTA } from "@/components/StickyCTA";
import { StarRating } from "@/components/StarRating";

export const revalidate = 3600; // ISR: Revalidate every 1 hour

interface PageProps {
  params: {
    locale: Locale;
  };
}

const IconMap: Record<string, any> = {
  Palette,
  Zap,
  BrainCircuit,
  Box
};

export function generateMetadata({ params }: PageProps) {
  return {
    title: params.locale === "en" ? `AI Product News | ${siteConfig.name}` : `أخبار منتجات الذكاء الاصطناعي | ${siteConfig.name}`,
    description: params.locale === "en" ? "Latest updates on AI tools" : "آخر تحديثات أدوات الذكاء الاصطناعي",
  };
}

export default function NewsPage({ params: { locale } }: PageProps) {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-6xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black md:text-6xl tracking-tight">
            {locale === "en" ? "AI Product News" : "أخبار منتجات الذكاء الاصطناعي"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {locale === "en" 
              ? "Curated updates on the tools that matter. Powered by AI Summaries." 
              : "تحديثات مختارة عن الأدوات التي تهمك. مدعومة بملخصات الذكاء الاصطناعي."}
          </p>
        </div>

        <AdSlot position="top" />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiNews.map((news) => {
            const Icon = IconMap[news.image] || Box;
            return (
              <div key={news.id} className="group relative flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {news.tag[locale]}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                      {news.title[locale]}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {news.date}
                    </div>
                  </div>

                  {/* AI Summary Badge */}
                  <div className="rounded-xl bg-primary/5 p-4 border border-primary/10 relative">
                    <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-bold text-primary flex items-center gap-1">
                      <BrainCircuit className="h-3 w-3" />
                      AI Summary
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {news.summary[locale]}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-auto space-y-4">
                  <StarRating toolName={news.title[locale]} locale={locale} />
                  <Link
                    href={news.link}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-muted py-3 text-sm font-bold transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {locale === "en" ? "Read Source" : "قراءة المصدر"}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <StickyCTA 
        context="news"
        locale={locale}
        primaryToolLink="/ar/news" // Fallback to news or a specific featured tool
      />
    </div>
  );
}
