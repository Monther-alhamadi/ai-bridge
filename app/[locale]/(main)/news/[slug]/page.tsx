import { notFound } from "next/navigation";
import type { Locale } from "@/config/i18n";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Share2, Clock, User, Calendar, Sparkles } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
import { NewsletterForm } from "@/components/NewsletterForm";
import { AffiliateCard } from "@/components/AffiliateCard";
import { articles } from "@/lib/articles";

// Use imported articles
const ARTICLES = articles;

interface ArticlePageProps {
  params: {
    locale: Locale;
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = ARTICLES[params.slug];
  
  if (!article) {
    return {
      title: "Article Not Found"
    };
  }

  const title = article.title[params.locale];
  const description = article.description[params.locale];
  const url = `${siteConfig.url}/${params.locale}/news/${params.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.image]
    }
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = ARTICLES[params.slug];

  if (!article) {
    notFound();
  }

  const locale = params.locale;
  const isRTL = locale === 'ar';
  const title = article.title[locale];
  const description = article.description[locale];
  const pageUrl = `${siteConfig.url}/${locale}/news/${params.slug}`;

  return (
    <article className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div 
          id="reading-progress" 
          className="h-full bg-gradient-to-r from-blue-500 to-primary transition-all duration-300"
          style={{ width: '0%' }}
        />
      </div>

      {/* Hero Section */}
      <header className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={article.image}
          alt={title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4 text-white/80 text-sm">
              <span className="bg-primary/90 px-3 py-1 rounded-full font-bold">
                {article.category[locale]}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readingTime} {locale === 'ar' ? 'دقيقة' : 'min read'}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight font-cairo">
              {title}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
              {description}
            </p>

            <div className="flex items-center gap-3 text-white/70">
              <User className="w-5 h-5" />
              <span className="font-medium">{article.author}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-[1fr_250px] gap-12">
          {/* Article Body */}
          <div className="max-w-3xl mx-auto lg:mx-0">
            {/* Social Share - Top */}
            <div className="mb-8 pb-8 border-b border-slate-200">
              <ShareButtons 
                url={pageUrl} 
                title={title} 
                locale={locale}
              />
            </div>

            {/* Article Content */}
            <div 
              className={`prose prose-lg max-w-none ${isRTL ? 'prose-rtl font-cairo' : ''} 
                prose-headings:font-black prose-headings:text-slate-900
                prose-p:text-slate-700 prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-strong:font-bold
                prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-slate-900 prose-pre:text-slate-100
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:italic
                prose-img:rounded-2xl prose-img:shadow-lg
                prose-table:border-collapse prose-th:bg-slate-100 prose-th:p-3 prose-td:p-3 prose-td:border`}
              dangerouslySetInnerHTML={{ __html: article.content[locale] }}
            />

            {/* Author Bio */}
            <div className="mt-16 p-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{article.author}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {locale === 'ar' 
                      ? 'فريق تحرير AI Bridge مكرس لتمكين المعلمين من خلال الأفكار القائمة على البيانات وحلول الذكاء الاصطناعي المتطورة.'
                      : 'The AI Bridge Editorial Team is dedicated to empowering educators through data-driven insights and cutting-edge AI solutions.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Affiliate Products */}
            {article.affiliateProducts && article.affiliateProducts.length > 0 && (
              <div className="mt-16 space-y-8">
                <h3 className="text-2xl font-black flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  {locale === 'ar' ? 'أدوات موصى بها' : 'Recommended Tools'}
                </h3>
                <div className="grid gap-6">
                  {article.affiliateProducts.map((product) => {
                    // We need the tool ID. In lib/articles.ts, we used names like "Gamma App".
                    // AffiliateManager uses IDs like "gamma". 
                    // Let's assume the name is close enough or use the URL to find it, 
                    // or better, update lib/articles.ts to include IDs if needed.
                    // For now, let's try to match by lowercase name or just pass a hardcoded ID if we can't find it.
                    const toolId = product.name.toLowerCase().split(' ')[0]; 
                    return <AffiliateCard key={product.name} toolId={toolId} locale={locale} />;
                  })}
                </div>
              </div>
            )}

            {/* Newsletter CTA - Lead Magnet */}
            <div className="mt-16" id="newsletter">
              <NewsletterForm locale={locale} />
            </div>

            {/* Related Articles */}
            <div className="mt-16">
              <h3 className="text-2xl font-black mb-6">
                {locale === 'ar' ? 'مقالات ذات صلة' : 'Related Articles'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Placeholder for related articles */}
                <div className="rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                  <h4 className="font-bold text-lg mb-2">
                    {locale === 'ar' ? 'أفضل 5 أدوات AI للمعلمين 2026' : 'Top 5 AI Tools for Teachers 2026'}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {locale === 'ar' ? 'اكتشف الأدوات الأساسية...' : 'Discover the essential tools...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* TOC */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4">
                  {locale === 'ar' ? 'المحتويات' : 'Contents'}
                </h3>
                <nav className="space-y-2 text-sm">
                  <a href="#intro" className="block text-slate-700 hover:text-primary transition-colors">
                    {locale === 'ar' ? 'المقدمة' : 'Introduction'}
                  </a>
                  <a href="#problem" className="block text-slate-700 hover:text-primary transition-colors">
                    {locale === 'ar' ? 'المشكلة' : 'The Problem'}
                  </a>
                  <a href="#solution" className="block text-slate-700 hover:text-primary transition-colors">
                    {locale === 'ar' ? 'الحل' : 'The Solution'}
                  </a>
                  {/* More TOC items */}
                </nav>
              </div>

              {/* Share Widget */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  {locale === 'ar' ? 'شارك' : 'Share'}
                </h3>
                <ShareButtons url={pageUrl} title={title} locale={locale} />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Reading Progress Script */}
      <script dangerouslySetInnerHTML={{ __html: `
        window.addEventListener('scroll', function() {
          const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = (winScroll / height) * 100;
          document.getElementById('reading-progress').style.width = scrolled + '%';
        });
      `}} />
    </article>
  );
}
