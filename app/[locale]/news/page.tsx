import { siteConfig } from "@/config/site";
import { AdSlot } from "@/components/AdSlot";
import { StickyCTA } from "@/components/StickyCTA";
import { NewsCard } from "@/components/NewsCard";
import { Newspaper, Zap, TrendingUp } from "lucide-react";
import { Badge } from "@/components/Badge";
import type { Locale } from "@/config/i18n";

// ISR: Revalidate every hour
export const revalidate = 3600;

interface PageProps {
  params: {
    locale: Locale;
  };
}

// This would fetch from your sync API or DB
async function getNews() {
  // Simulating fetching processed news
  return [
    {
      id: "1",
      title: { en: "OpenAI Launches o1 (Strawberry)", ar: "أوبن إي آي تطلق نموذج o1 (الفراولة)" },
      summary: { 
        en: "A revolutionary reasoning model that thinks before it speaks, solving PhD-level science problems.",
        ar: "موديل تفكير ثوري يفكر قبل أن يجيب، مصمم لحل أعقد المسائل العلمية والبرمجية."
      },
      source: "OpenAI Blog",
      date: new Date().toISOString(),
      tag: "Technology",
      score: 4.9,
      link: "https://openai.com",
      tool_affiliate: "https://openai.com"
    },
    {
      id: "2",
      title: { en: "Cursor AI editor hits $50M ARR", ar: "آداة Cursor AI لتخطي 50 مليون دولار مبيعات سنوية" },
      summary: { 
        en: "The AI-first code editor is revolutionizing how developers write code.",
        ar: "محرر الأكواد الأول المعتمد على الذكاء الاصطناعي يغير قواعد اللعبة للمبرمجين."
      },
      source: "TechCrunch",
      date: new Date().toISOString(),
      tag: "Coding",
      score: 4.8,
      link: "https://techcrunch.com",
      tool_affiliate: "https://cursor.com"
    },
    {
      id: "3",
      title: { en: "Flux.1: The Midjourney Rival?", ar: "Flux.1: هل هو منافس Midjourney الحقيقي؟" },
      summary: { 
        en: "Black Forest Labs releases a high-fidelity image gen model.",
        ar: "إطلاق نموذح Flux.1 الذي يقدم دقة خيالية في الصور، منافساً قوياً لـ Midjourney."
      },
      source: "The Verge",
      date: new Date().toISOString(),
      tag: "Design",
      score: 4.7,
      link: "https://theverge.com",
      tool_affiliate: "https://fal.ai"
    },
    {
      id: "4",
      title: { en: "Claude 3.5 Sonnet: The New King?", ar: "كلود 3.5 سونيت: هل هو الملك الجديد للموديلات؟" },
      summary: { 
        en: "Anthropic's newest model outperforms GPT-4o in coding and reasoning.",
        ar: "موديل أنثروبيك الأحدث يتفوق على GPT-4o في البرمجة والتفكير المنطقي."
      },
      source: "Anthropic",
      date: new Date().toISOString(),
      tag: "Enterprise AI",
      score: 5.0,
      link: "https://anthropic.com",
      tool_affiliate: "https://anthropic.com"
    }
  ];
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
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <Badge variant="outline" className="px-4 py-1 border-primary/20 text-primary gap-2 bg-primary/5">
              <Zap className="h-3 w-3 fill-current" />
              {locale === "en" ? "AI Pulse - Updated Hourly" : "نبض الذكاء - تحديث كل ساعة"}
            </Badge>
          </div>
          <h1 className="text-4xl font-black md:text-5xl lg:text-7xl">
            {locale === "en" ? "The AI " : ""}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {locale === "en" ? "Newsroom" : "غرفة أخبار الذكاء"}
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            {locale === "en" 
              ? "Automated AI summaries from 50+ tech sources, translated and analyzed for the strategic mind."
              : "ملخصات ذكية مؤتمتة من أكثر من 50 مصدراً تقنياً، مترجمة ومحللة للعقول الاستراتيجية."}
          </p>
        </div>

        {/* Ad Slot */}
        <AdSlot position="top" />

        {/* Bento Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
           {/* Primary Item (Large) */}
           <div className="sm:col-span-2 lg:row-span-2">
             <NewsCard item={news[0] as any} locale={locale as any} />
           </div>
           
           {/* Regular Items */}
           {news.slice(1).map((item) => (
             <NewsCard key={item.id} item={item as any} locale={locale as any} />
           ))}
        </div>

        {/* Ad Slot Middle */}
        <AdSlot position="middle" />

        {/* Newsletter Funnel */}
        <div className="rounded-3xl bg-primary p-8 md:p-12 text-primary-foreground text-center space-y-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full" />
           <TrendingUp className="h-12 w-12 mx-auto opacity-50" />
           <h2 className="text-3xl font-black md:text-4xl">
             {locale === "en" ? "Stay Ahead of the Curve" : "كن دائماً في المقدمة"}
           </h2>
           <p className="text-primary-foreground/80 max-w-md mx-auto">
             {locale === "en" ? "Get our 'Elite AI Digest' every Sunday. High-signal, zero-noise." : "احصل على ملخص النخبة الأسبوعي كل أحد. محتوى عالي القيمة، بعيداً عن ضجيج المنصات."}
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-all">
                 {locale === "en" ? "Subscribe Now" : "اشترك مجاناً"}
              </button>
           </div>
        </div>

      </div>

      <StickyCTA 
        context="news"
        locale={locale as any} 
        primaryToolLink={news[0].tool_affiliate}
      />
    </div>
  );
}
