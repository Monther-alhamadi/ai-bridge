"use client";

import { Check, Zap, Crown, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { trackEvent } from "@/lib/analytics";

interface PricingPageProps {
  params: { locale: "en" | "ar" };
}

export default function PricingPage({ params: { locale } }: PricingPageProps) {
  const [showWaitlist, setShowWaitlist] = useState(false);

  // Translation helpers
  const t = {
    title: locale === "en" ? "Invest in Your Productivity" : "استثمر في إنتاجيتك",
    subtitle: locale === "en" ? "Choose the plan that fits your growth." : "اختر الخطة المناسبة لنموك.",
    free: { name: "Explorer", price: "Free", cta: "Current Plan" },
    pro: { name: "Pro", price: "$19", cta: "Join Waitlist" },
    team: { name: "Enterprise", price: "Custom", cta: "Contact Sales" },
    features: [
      { name: { en: "Access to 500+ Tools", ar: "الوصول لـ 500+ أداة" }, tiers: [true, true, true] },
      { name: { en: "Basic Comparisons", ar: "مقارنات أساسية" }, tiers: [true, true, true] },
      { name: { en: "AI Matchmaker Quiz", ar: "اختبار التوافق الذكي" }, tiers: [true, true, true] },
      { name: { en: "Advanced Analytics", ar: "تحليلات متقدمة" }, tiers: [false, true, true] },
      { name: { en: "Priority Support", ar: "دعم فني عاجل" }, tiers: [false, true, true] },
      { name: { en: "API Access", ar: "API للوصول للبيانات" }, tiers: [false, false, true] },
    ]
  };

  const handleProClick = () => {
    trackEvent("begin_checkout", { item_name: "pro_plan", context: "pricing_page" });
    setShowWaitlist(true);
  };

  return (
    <div className="container py-24 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-black md:text-6xl tracking-tight text-primary">
          {t.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* FREE */}
        <div className="rounded-3xl border bg-card/50 p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="flex items-center gap-2 text-primary/80">
            <Zap className="h-5 w-5" />
            <span className="font-bold text-sm tracking-widest uppercase">{t.free.name}</span>
          </div>
          <div className="text-4xl font-black">{t.free.price}</div>
          <button disabled className="w-full rounded-xl bg-muted py-3 font-bold opacity-50 cursor-not-allowed">
            {locale === "en" ? "Current Plan" : "الخطة الحالية"}
          </button>
          <ul className="space-y-4 flex-1">
            {t.features.map((f, i) => (
              f.tiers[0] && (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  {f.name[locale]}
                </li>
              )
            ))}
          </ul>
        </div>

        {/* PRO (Best Value) */}
        <div className="rounded-3xl border-2 border-primary bg-background p-8 flex flex-col gap-6 relative shadow-2xl scale-105">
          <div className="absolute top-0 right-0 bg-primary px-4 py-1 rounded-bl-xl text-xs font-bold text-primary-foreground">
            {locale === "en" ? "MOST POPULAR" : "الأكثر طلباً"}
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Crown className="h-5 w-5" />
            <span className="font-bold text-sm tracking-widest uppercase">{t.pro.name}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black">{t.pro.price}</span>
            <span className="text-muted-foreground">/mo</span>
          </div>
          <button 
            onClick={handleProClick}
            className="w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-95 animate-pulse hover:animate-none"
          >
            {locale === "en" ? "Join Waitlist" : "انضم لقائمة الانتظار"}
          </button>
          <ul className="space-y-4 flex-1">
            {t.features.map((f, i) => (
              f.tiers[1] && (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {f.name[locale]}
                </li>
              )
            ))}
          </ul>
        </div>

        {/* ENTERPRISE */}
        <div className="rounded-3xl border bg-card/50 p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="flex items-center gap-2 text-primary/80">
            <Shield className="h-5 w-5" />
            <span className="font-bold text-sm tracking-widest uppercase">{t.team.name}</span>
          </div>
          <div className="text-4xl font-black">{t.team.price}</div>
          <Link 
            href="mailto:sales@ai-bridge.com"
            className="w-full rounded-xl border-2 border-primary py-3 font-bold text-primary text-center hover:bg-primary/5 transition-colors"
          >
            {t.team.cta}
          </Link>
          <ul className="space-y-4 flex-1">
             {t.features.map((f, i) => (
              f.tiers[2] && (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  {f.name[locale]}
                </li>
              )
            ))}
          </ul>
        </div>
      </div>

      {/* Waitlist Modal Logic */}
      {showWaitlist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md p-6 rounded-3xl border shadow-2xl relative">
             <button 
               onClick={() => setShowWaitlist(false)} 
               className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
             >
               ✕
             </button>
             <h3 className="text-2xl font-bold text-center mb-4">
               {locale === "en" ? "Pro Plan is Coming Soon!" : "الخطة الاحترافية قادمة قريباً!"}
             </h3>
             <p className="text-center text-muted-foreground mb-6">
               {locale === "en" 
                 ? "We are finalizing the Stripe integration. Sign up to get 50% off when we launch." 
                 : "نقوم حالياً بربط بوابات الدفع. سجل الآن لتحصل على خصم 50% عند الإطلاق."}
             </p>
             <NewsletterSignup locale={locale} profession="waitlist_pro" />
          </div>
        </div>
      )}
    </div>
  );
}
