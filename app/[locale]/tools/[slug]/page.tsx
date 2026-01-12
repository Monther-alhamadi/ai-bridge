import { Metadata } from "next";
import { notFound } from "next/navigation";
import { professions } from "@/config/professions";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { AdSlot } from "@/components/AdSlot";
import { PromptGenerator } from "@/components/PromptGenerator";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedTools } from "@/components/RelatedTools";
import { ComparisonTable } from "@/components/ComparisonTable";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { StickyCTA } from "@/components/StickyCTA";
import { SmartInsight } from "@/components/SmartInsight";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TeacherModule } from "@/components/modules/TeacherModule";
import { CheckCircle2, Sparkles } from "lucide-react";

// Module Registry mapping slugs to their specialized components
const MODULE_REGISTRY: Record<string, any> = {
  teacher: TeacherModule,
};


interface PageProps {
  params: {
    locale: Locale;
    slug: string;
  };
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const profession = professions.find((p) => p.slug === params.slug);
  if (!profession) return {};

  const locale = params.locale;
  const title = profession.seoTitle?.[locale] || (params.locale === "en" 
    ? `AI Tools for ${profession.title.en} | ${siteConfig.name}`
    : `أدوات الذكاء الاصطناعي لـ ${profession.title.ar} | ${siteConfig.name}`);
    
  const description = profession.seoDescription?.[locale] || profession.description[locale];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${params.locale}/tools/${params.slug}`,
    },
  };
}

export default async function ProfessionToolPage({ params }: PageProps) {
  const profession = professions.find((p) => p.slug === params.slug);

  if (!profession) {
    notFound();
  }

  const locale = params.locale;
  const pageUrl = `${siteConfig.url}/${locale}/tools/${params.slug}`;
  const pageTitle = profession.title[locale];
  const seoTitle = profession.seoTitle?.[locale] || (locale === "en" ? `AI Tools for ${pageTitle}` : `أدوات الذكاء الاصطناعي لـ ${pageTitle}`);

  const ProfessionModule = MODULE_REGISTRY[params.slug];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: locale === "en" ? "Hub" : "الرئيسية", href: `/${locale}` },
    { label: locale === "en" ? "Explore Tools" : "استكشف الأدوات", href: `/${locale}/tools` },
    { label: pageTitle, href: `/${locale}/tools/${params.slug}` }
  ];

  // JSON-LD Schema
  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": `${pageTitle} AI Prompt Tool`,
      "description": profession.description[locale],
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "url": pageUrl,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ];

  // Add FAQ Schema if exists
  if (profession.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": profession.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question[locale],
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer[locale]
        }
      }))
    });
  }

  // Add Review/Product Schema for recommended tools
  profession.recommendedTools.forEach(tool => {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Review",
      "itemReviewed": {
        "@type": "SoftwareApplication",
        "name": tool.name,
        "description": tool.description[locale],
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": tool.rating,
        "bestRating": "5"
      },
      "author": {
        "@type": "Organization",
        "name": siteConfig.name
      },
      "publisher": {
        "@type": "Organization",
        "name": siteConfig.name
      }
    });
  });


  return (
    <div className="container py-12 md:py-20">
      {/* Schema Scripts */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}


      <div className="mx-auto max-w-4xl space-y-12">
        {/* Breadcrumbs for SEO & UX */}
        <Breadcrumbs items={breadcrumbItems} locale={locale} />
        {/* Ad Slot (Top) */}
        <AdSlot position="top" />

        {/* Header Section */}
        <div className="space-y-4 text-center md:text-start">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-balance">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {seoTitle}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {profession.description[locale]}
          </p>
          
          <div className="flex flex-col items-center justify-between gap-6 pt-4 md:flex-row">
            <ShareButtons url={pageUrl} title={pageTitle} locale={locale} />
          </div>
        </div>

        {/* Main Tool Component */}
        <section className="relative">
          <PromptGenerator 
            template={profession.aiPromptTemplate[locale]} 
            profession={pageTitle} 
            locale={locale} 
          />
        </section>

        <SmartInsight 
          profession={profession.slug} 
          locale={locale} 
        />

        {/* Profession-Specific Specialized Module (Phase 12 Modular Architecture) */}
        {ProfessionModule && (
          <div className="py-8">
            <ProfessionModule locale={locale} />
          </div>
        )}

        {/* Newsletter Funnel (Lead Magnet) */}
        <section id="newsletter">
          <NewsletterSignup profession={pageTitle} locale={locale} />
        </section>

        {/* Comparison Table (Affiliate / Conversion) */}
        <section>
          <ComparisonTable tools={profession.recommendedTools} locale={locale} />
        </section>

        {/* Ad Slot (Middle) */}
        <AdSlot position="middle" />

        {/* Content Section: Benefits */}
        <section className="rounded-2xl border bg-muted/30 p-8 md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            {locale === "en" ? `Benefits of AI for ${pageTitle}` : `فوائد الذكاء الاصطناعي لـ ${pageTitle}`}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {profession.benefits[locale].map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
                <p className="text-lg leading-snug">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section (SEO Layer) */}
        {profession.faqs.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold md:text-3xl">
              {locale === "en" ? "Frequently Asked Questions" : "الأسئلة الشائعة"}
            </h2>
            <div className="grid gap-4">
              {profession.faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="text-lg font-bold">{faq.question[locale]}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer[locale]}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Tools */}
        <section className="pt-8">
          <RelatedTools currentSlug={profession.slug} locale={locale} />
        </section>


        {/* Ad Slot (Footer) */}
        <AdSlot position="footer" />
      </div>

      {/* Sticky Conversion Bar */}
      <StickyCTA 
        profession={pageTitle} 
        locale={locale} 
        primaryToolLink={profession.recommendedTools[0]?.affiliateUrl || profession.recommendedTools[0]?.link || "#"} 
      />
    </div>
  );
}
