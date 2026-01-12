import { professions } from "@/config/professions";
import { ArrowRight, Sparkles, Gavel, Stethoscope, Palette } from "lucide-react";
import type { Locale } from "@/config/i18n";
import Link from "next/link";
import { Badge } from "@/components/Badge";

interface ToolsPageProps {
  params: {
    locale: Locale;
  };
}

const COMING_SOON = [
  {
    id: "lawyer",
    title: { en: "AI for Lawyers", ar: "الذكاء للمحامين" },
    icon: Gavel,
    description: { en: "Automated case analysis and document drafting.", ar: "تحليل القضايا وصياغة العقود آلياً." }
  },
  {
    id: "doctor",
    title: { en: "AI for Doctors", ar: "الذكاء للأطباء" },
    icon: Stethoscope,
    description: { en: "Diagnostic assistance and medical research synthesis.", ar: "المساعدة في التشخيص وتلخيص الأبحاث الطبية." }
  },
  {
    id: "designer",
    title: { en: "AI for Designers", ar: "الذكاء للمصممين" },
    icon: Palette,
    description: { en: "Generative assets and style transfer optimization.", ar: "توليد الأصول البصرية وتطوير الأنماط والمؤثرات." }
  }
];

export default function ToolsHubPage({ params: { locale } }: ToolsPageProps) {
  return (
    <div className="container py-12 md:py-24 space-y-16">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <Badge variant="outline" className="px-4 py-1 border-primary/20 text-primary gap-2 bg-primary/5">
          <Sparkles className="h-3 w-3 fill-current" />
          {locale === "en" ? "Universal AI Access" : "وصول شامل للذكاء الاصطناعي"}
        </Badge>
        <h1 className="text-4xl font-black md:text-6xl tracking-tight">
          {locale === "en" ? "Explore " : "استكشف "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {locale === "en" ? "The Career Hub" : "مركز المهن الذكي"}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground md:text-xl">
          {locale === "en" 
            ? "Select your profession to unlock specialized AI power-ups tailored for your specific career goals."
            : "اختر مهنتك لفتح أدوات الذكاء الاصطناعي المتخصصة والمصممة خصيصاً لأهدافك المهنية."}
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Active Professions */}
        {professions.map((p) => (
          <Link
            key={p.id}
            href={`/${locale}/tools/${p.slug}`}
            className="group relative overflow-hidden rounded-3xl border bg-card p-8 transition-all hover:border-primary hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full shadow-sm"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="h-24 w-24 -mr-8 -mt-8" />
            </div>
            
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
              <Sparkles className="h-7 w-7" /> {/* Could map icon here if exported from config */}
            </div>
            
            <h3 className="text-2xl font-bold tracking-tight">{p.title[locale]}</h3>
            <p className="mt-3 text-muted-foreground flex-grow leading-relaxed">
              {p.description[locale]}
            </p>
            
            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
              {locale === "en" ? "Enter Module" : "دخول الوحدة"}
              <ArrowRight className={locale === "ar" ? "h-4 w-4 rotate-180" : "h-4 w-4"} />
            </div>
          </Link>
        ))}

        {/* Coming Soon Hooks (Strategic Growth) */}
        {COMING_SOON.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-3xl border border-dashed bg-muted/30 p-8 grayscale transition-all hover:grayscale-0 flex flex-col h-full opacity-60 hover:opacity-100"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Icon className="h-7 w-7" />
              </div>
              
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight text-muted-foreground">{p.title[locale]}</h3>
                <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest bg-background">
                   {locale === "en" ? "Soon" : "قريباً"}
                </Badge>
              </div>
              
              <p className="mt-3 text-muted-foreground flex-grow text-sm leading-relaxed">
                {p.description[locale]}
              </p>
              
              <div className="mt-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {locale === "en" ? "Under Development" : "تحت التطوير"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Banner */}
      <div className="rounded-3xl bg-secondary/30 p-12 text-center border">
        <h2 className="text-2xl font-bold mb-4">
          {locale === "en" ? "Can't find your profession?" : "لم تجد مهنتك؟"}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          {locale === "en" 
            ? "We are adding new modules every week. Join the waitlist to get notified when we launch for your industry." 
            : "نحن نضيف وحدات جديدة كل أسبوع. انضم لقائمة الانتظار ليصلك إشعار عند إطلاق تخصصك."}
        </p>
        <Link 
            href={`/${locale}/pricing`}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-primary text-primary px-8 text-sm font-bold hover:bg-primary hover:text-white transition-all"
        >
            {locale === "en" ? "Request Module" : "اطلب تخصصك"}
        </Link>
      </div>
    </div>
  );
}
