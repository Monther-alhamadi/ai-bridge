import { notFound } from "next/navigation";
import { comparisons } from "@/config/comparisons";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { Check, X, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { StickyCTA } from "@/components/StickyCTA";
import { StarRating } from "@/components/StarRating";
import { BuyersGuide } from "@/components/BuyersGuide";
import { TrackedLink } from "@/components/TrackedLink";

export const revalidate = 86400; // ISR: Revalidate every 24 hours

export async function generateStaticParams() {
  return comparisons.map((comparison) => ({
    slug: comparison.slug,
  }));
}

interface PageProps {
  params: {
    locale: Locale;
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const comparison = comparisons.find((c) => c.slug === params.slug);
  if (!comparison) return {};

  return {
    title: `${comparison.title[params.locale]} | ${siteConfig.name}`,
    description: comparison.summary[params.locale],
  };
}

export default function ComparisonPage({ params: { locale, slug } }: PageProps) {
  const comparison = comparisons.find((c) => c.slug === slug);

  if (!comparison) {
    notFound();
  }

  const { toolA, toolB } = comparison;

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-4 text-4xl md:text-6xl font-black">
            <span className="text-primary">{toolA.name}</span>
            <span className="text-muted-foreground text-2xl md:text-4xl">vs</span>
            <span className="text-primary">{toolB.name}</span>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {comparison.summary[locale]}
          </p>
        </div>

        <AdSlot position="top" />

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tool A */}
          <div className="rounded-3xl border bg-card p-8 space-y-6 shadow-lg">
             <div className="text-2xl font-bold text-center">{toolA.name}</div>
             <div className="space-y-4">
               {comparison.points.map((point, idx) => (
                 <div key={idx} className="flex justify-between items-center border-b pb-4 last:border-0">
                   <span className="text-sm text-muted-foreground font-medium">{point.feature[locale]}</span>
                   <span className={point.winner === "A" ? "font-bold text-green-600" : ""}>
                     {point.toolA_value[locale]}
                   </span>
                 </div>
               ))}
             </div>
          </div>

          {/* Tool B */}
          <div className="rounded-3xl border bg-card p-8 space-y-6 shadow-lg relative overflow-hidden">
             {/* Winner Glow (Assuming B wins for demo) */}
             <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
             
             <div className="text-2xl font-bold text-center flex items-center justify-center gap-2">
               {toolB.name}
               <Trophy className="h-6 w-6 text-amber-500" />
             </div>
             <div className="space-y-4">
               {comparison.points.map((point, idx) => (
                 <div key={idx} className="flex justify-between items-center border-b pb-4 last:border-0">
                   <span className="text-sm text-muted-foreground font-medium">{point.feature[locale]}</span>
                   <span className={point.winner === "B" ? "font-bold text-green-600" : ""}>
                     {point.toolB_value[locale]}
                   </span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Verdict */}
        <div className="rounded-[2.5rem] bg-primary text-primary-foreground p-10 md:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 blur-3xl -z-10" />
          
          <h2 className="text-3xl font-black uppercase tracking-widest">
            {locale === "en" ? "The Verdict" : "الحكم النهائي"}
          </h2>
          <div className="text-4xl md:text-5xl font-black">
            {comparison.verdict.winnerName}
          </div>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            {comparison.verdict.description[locale]}
          </p>

          <div className="mx-auto max-w-sm pt-4">
            <StarRating toolName={comparison.verdict.winnerName} locale={locale} />
          </div>

          <div className="pt-8">
            <TrackedLink
              href={comparison.verdict.winnerName === toolA.name ? (toolA.affiliateUrl || "#") : (toolB.affiliateUrl || "#")}
              name={comparison.verdict.winnerName}
              context="comparison_verdict"
              target="_blank"
              className="inline-flex items-center gap-3 rounded-2xl bg-background text-primary px-8 py-4 text-xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-xl"
            >
              {locale === "en" ? "Get The Winner" : "احصل على الفائز"}
              <ArrowRight className={locale === "ar" ? "rotate-180" : ""} />
            </TrackedLink>
          </div>
        </div>

        {/* Dynamic Buyer's Guide */}
        <BuyersGuide toolA={toolA.name} toolB={toolB.name} locale={locale} />
      </div>

      <StickyCTA 
        context="comparison"
        locale={locale}
        primaryToolLink={comparison.verdict.winnerName === toolA.name ? (toolA.affiliateUrl || "#") : (toolB.affiliateUrl || "#")}
      />
    </div>
  );
}
