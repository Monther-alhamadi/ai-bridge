import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { AdSlot } from "@/components/AdSlot";
import { Badge } from "@/components/Badge";
import { NewsletterForm } from "@/components/NewsletterForm";
import { NewsCard } from "@/components/NewsCard";
import { StickyCTA } from "@/components/StickyCTA";
import type { Locale } from "@/config/i18n";
import { articles, type Article } from "@/lib/articles";
import { supabase } from "@/lib/supabase";
import { Newspaper, TrendingUp, Zap } from "lucide-react";

export const revalidate = 3600;

interface PageProps {
  params: {
    locale: Locale;
  };
}

type NewsIntent = "education" | "coding" | "general";

interface NewsFeedItem {
  id: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  source: string;
  date: string;
  tag: string;
  score: number;
  link: string;
  tool_affiliate?: string;
  intent?: NewsIntent;
}

async function getNews(): Promise<NewsFeedItem[]> {
  try {
    if (!supabase) {
      console.warn("Supabase not configured. Using empty news state.");
      return [];
    }

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => ({
      id: String(item.id),
      title: {
        en: item.title_en,
        ar: item.title_ar,
      },
      summary: {
        en: item.summary_en,
        ar: item.summary_ar,
      },
      source: item.source,
      date: item.date,
      tag: item.tag,
      score: item.score ?? 4.5,
      link: item.source_link,
      tool_affiliate: item.tool_affiliate ?? undefined,
      intent: item.intent ?? "general",
    }));
  } catch (error) {
    console.error("Supabase fetch error:", error);
    return [];
  }
}

export function generateMetadata({ params }: PageProps) {
  return {
    title:
      params.locale === "en"
        ? `AI News Room | ${siteConfig.name}`
        : `غرفة أخبار الذكاء | ${siteConfig.name}`,
    description:
      params.locale === "en"
        ? "Daily AI summaries and tool updates."
        : "آخر أخبار وتحديثات أدوات الذكاء الاصطناعي يومياً",
  };
}

export default async function NewsPage({ params: { locale } }: PageProps) {
  const news = await getNews();
  const featuredArticles = Object.values(articles) as Article[];
  const primaryToolLink = news[0]?.tool_affiliate ?? `/${locale}/tools`;

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsGuide",
    headline:
      locale === "en"
        ? "Latest AI News & Updates"
        : "آخر أخبار وتحديثات الذكاء الاصطناعي",
    description:
      locale === "en"
        ? "Daily AI summaries, tool updates, and industry moves."
        : "ملخصات يومية، تحديثات الأدوات، وتحركات الصناعة في عالم الذكاء الاصطناعي.",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
  };

  return (
    <div className="container py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />

      <div className="mx-auto max-w-6xl space-y-12">
        <header className="space-y-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 animate-pulse text-primary" />
            <h1 className="text-4xl font-extrabold md:text-5xl">
              {locale === "en" ? "AI News Room" : "غرفة أخبار الذكاء الاصطناعي"}
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {locale === "en"
              ? "Daily AI summaries, tool updates, and insights to keep you ahead."
              : "ملخصات يومية، تحديثات الأدوات، ورؤى لتبقى في المقدمة."}
          </p>
        </header>

        <AdSlot position="top" />

        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="flex items-center gap-2 text-2xl font-black">
              <TrendingUp className="h-6 w-6 text-primary" />
              {locale === "en" ? "Featured Articles" : "مقالات مميزة"}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/${locale}/news/${article.slug}`}
                className="group block"
              >
                <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl">
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                    <Image
                      src={article.image}
                      alt={article.title[locale]}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute left-4 top-4">
                      <Badge
                        variant="default"
                        className="bg-primary/90 font-bold text-white"
                      >
                        {article.category[locale]}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 p-6">
                    <h3 className="line-clamp-2 text-xl font-black leading-tight transition-colors group-hover:text-primary">
                      {article.title[locale]}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {article.excerpt[locale]}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {article.readingTime}{" "}
                        {locale === "ar" ? "دقيقة" : "min"}
                      </span>
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString(
                          locale === "ar" ? "ar-SA" : "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <div className="my-16 border-t-2 border-dashed border-slate-200" />

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="flex items-center gap-2 text-2xl font-black">
              <Newspaper className="h-6 w-6 text-primary" />
              {locale === "en"
                ? "Latest AI News"
                : "آخر أخبار الذكاء الاصطناعي"}
            </h2>
          </div>
        </section>

        {news.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="sm:col-span-2 lg:row-span-2">
              <NewsCard item={news[0]} locale={locale} />
            </div>

            {news.slice(1).map((item) => (
              <NewsCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border bg-muted/20 py-20 text-center">
            <Newspaper className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {locale === "en"
                ? "No news available yet. Check back later!"
                : "لا يوجد أخبار حالياً. عد لاحقاً!"}
            </p>
          </div>
        )}

        <AdSlot position="middle" />

        <div className="my-12">
          <NewsletterForm locale={locale} />
        </div>
      </div>

      <StickyCTA
        context="news"
        locale={locale}
        primaryToolLink={primaryToolLink}
      />
    </div>
  );
}
