import { Metadata } from "next";
import { notFound } from "next/navigation";
import { professions } from "@/config/professions";
import { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { AdSlot } from "@/components/AdSlot";
import { PromptGenerator } from "@/components/PromptGenerator";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedTools } from "@/components/RelatedTools";
import { CheckCircle2 } from "lucide-react";

interface PageProps {
  params: {
    locale: Locale;
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const profession = professions.find((p) => p.slug === params.slug);
  if (!profession) return {};

  const title = params.locale === "en" 
    ? `AI Tools for ${profession.title.en} | ${siteConfig.name}`
    : `أدوات الذكاء الاصطناعي لـ ${profession.title.ar} | ${siteConfig.name}`;

  return {
    title,
    description: profession.description[params.locale],
    openGraph: {
      title,
      description: profession.description[params.locale],
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

  // JSON-LD Schema
  const jsonLd = {
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
  };

  return (
    <div className="container py-12 md:py-20">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl space-y-12">
        {/* Ad Slot (Top) */}
        <AdSlot position="top" />

        {/* Header Section */}
        <div className="space-y-4 text-center md:text-start">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {locale === "en" ? `AI Tools for ${pageTitle}` : `أدوات الذكاء الاصطناعي لـ ${pageTitle}`}
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

        {/* Ad Slot (Middle) */}
        <AdSlot position="middle" />

        {/* Content Section: Benefits */}
        <section className="rounded-2xl border bg-muted/30 p-8 md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">
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

        {/* Related Tools */}
        <section className="pt-8">
          <RelatedTools currentSlug={profession.slug} locale={locale} />
        </section>

        {/* Ad Slot (Footer) */}
        <AdSlot position="footer" />
      </div>
    </div>
  );
}
