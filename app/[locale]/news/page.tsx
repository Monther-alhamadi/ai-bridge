import { siteConfig } from "@/config/site";
import { AdSlot } from "@/components/AdSlot";
import { StickyCTA } from "@/components/StickyCTA";
import { NewsCard } from "@/components/NewsCard";
import { Newspaper, Zap, TrendingUp } from "lucide-react";
import { Badge } from "@/components/Badge";
import type { Locale } from "@/config/i18n";
import { supabase } from "@/lib/supabase";
import { articles } from "@/lib/articles";
import Link from "next/link";
import Image from "next/image";
import { NewsletterForm } from "@/components/NewsletterForm";

// ISR: Revalidate every hour
export const revalidate = 3600;

interface PageProps {
  params: {
    locale: Locale;
  };
}

async function getNews() {
  try {
    if (!supabase) {
      console.warn("Supabase not configured. Using fallback empty news.");
      return [];
    }

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false })
      .limit(20);

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id.toString(),
      title: { en: item.title_en, ar: item.title_ar },
      summary: { en: item.summary_en, ar: item.summary_ar },
      source: item.source,
      date: item.date,
      tag: item.tag,
      score: item.score || 4.5,
      link: item.source_link,
      tool_affiliate: item.tool_affiliate,
      intent: item.intent
    }));
  } catch (err) {
    console.error("Supabase Fetch Error:", err);
    return []; // Return empty array to avoid page crash, fallback logic
  }
}

export function generateMetadata({ params }: PageProps) {
  return {
    title: params.locale === "en" ? `AI News Room | ${siteConfig.name}` : `غرفة أخبار الذكاء | ${siteConfig.name}`,
    description: params.locale === "en" ? "Daily AI summaries and tool updates." : "آخر أخبار وتحديثات أدوات الذكاء الاصطناعي يومياً",
  };
}

export default async function NewsPage({ params: { locale } }: PageProps) {
  const news = await getNews();

  // News JSON-LD Schema
  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsGuide",
    "headline": locale === "en" ? "Latest AI News & Updates" : "آخر أخبار وتحديثات الذكاء الاصطناعي",
    "description": locale === "en" ? "Daily AI summaries, tool updates, and industry moves." : "ملخصات يومية، تحديثات الأدوات، وتحركات الصناعة في عالم الذكاء الاصطناعي.",
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/logo.png`
      }
    }
  };

  return (
    <div className="container py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-extrabold md:text-5xl">
              {locale === "en" ? "AI News Room" : "غرفة أخبار الذكاء الاصطناعي"}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === "en" 
              ? "Daily AI summaries, tool updates, and insights to keep you ahead." 
              : "ملخصات يومية، تحديثات الأدوات، ورؤى لتبقى في المقدمة."}
          </p>
        </header>

        <AdSlot position="top" />

        {/* Featured Articles Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              {locale === "en" ? "Featured Articles" : "مقالات مميزة"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(articles).map((article: any) => (
              <Link 
                key={article.slug}
                href={`/${locale}/news/${article.slug}`}
                className="group block"
              >
                <article className="h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                    <Image
                      src={article.image}
                      alt={article.title[locale]}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" className="bg-primary/90 text-white font-bold">
                        {article.category[locale]}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {article.title[locale]}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {article.excerpt[locale]}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {article.readingTime} {locale === "ar" ? "دقيقة" : "min"}
                      </span>
                      <span>{new Date(article.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="my-16 border-t-2 border-dashed border-slate-200" />

        {/* Latest AI News Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-primary" />
               {locale === "en" ? "Latest AI News" : "آخر أخبار الذكاء الاصطناعي"}
            </h2>
          </div>
        </section>

        {/* Bento Grid */}
        {news.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
             {/* Primary Item (Large) */}
             <div className="sm:col-span-2 lg:row-span-2">
               <NewsCard item={news[0] as any} locale={locale as any} />
             </div>
             
             {/* Regular Items */}
             {news.slice(1).map((item: any) => (
               <NewsCard key={item.id} item={item as any} locale={locale as any} />
             ))}
          </div>
        ) : (
          <div className="text-center py-20 border rounded-3xl bg-muted/20">
            <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {locale === "en" ? "No news available yet. Check back later!" : "لا يوجد أخبار حالياً. عد لاحقاً!"}
            </p>
          </div>
        )}

        {/* Ad Slot Middle */}
        <AdSlot position="middle" />

        {/* Newsletter Lead Magnet - 50 Prompts Guide */}
        <div className="my-12">
          <NewsletterForm locale={locale} />
        </div>

      </div>

      <StickyCTA 
        context="news"
        locale={locale as any} 
        primaryToolLink={news.length > 0 ? news[0].tool_affiliate : `/${locale}/tools`}
      />
    </div>
  );
}
