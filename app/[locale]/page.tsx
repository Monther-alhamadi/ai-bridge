import { professions } from "@/config/professions";
import { ArrowRight, GraduationCap, Calculator, Scale, Users, Store, BookOpen, Video, Sparkles } from "lucide-react";
import type { Locale } from "@/config/i18n";
import { getDictionary } from "@/lib/get-dictionary";
import Link from "next/link";
import { AIQuiz } from "@/components/AIQuiz";

const IconMap: Record<string, any> = {
  GraduationCap,
  Calculator,
  Scale,
  Users,
  Store,
  BookOpen,
  Video,
};

interface LandingPageProps {
  params: {
    locale: Locale;
  };
}

import { NewsPulse } from "@/components/NewsPulse";

export default async function LandingPage({ params: { locale } }: LandingPageProps) {
  const dictionary = await getDictionary(locale);


  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* News Pulse (Live Ticker) */}
      <div className="container pt-8 md:pt-12">
        <NewsPulse locale={locale} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 md:pt-24 lg:pt-32 text-center md:text-start">
        <div className="container relative z-10 flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {locale === 'ar' 
                ? 'توقف عن التحضير اليدوي.. دع النظام يقرأ كتابك ويجدول عامك الدراسي في دقيقتين' 
                : 'Stop manual planning... Let the system read your book and schedule your year in 2 minutes'}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {dictionary.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/tools/teacher`}
              className="inline-flex h-16 items-center justify-center rounded-2xl bg-primary px-10 text-xl font-black text-primary-foreground shadow-2xl transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-primary/30"
            >
              {locale === 'ar' ? 'ابدأ رحلتك المجانية' : 'Start Your Free Journey'}
              <ArrowRight className={locale === "ar" ? "mr-3 h-6 w-6 rotate-180" : "ml-3 h-6 w-6"} />
            </Link>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-[120px]" />
      </section>
      
      {/* Quiz Section (Viral Loop) */}
      <section className="container py-12 md:py-24">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl font-black md:text-5xl tracking-tight">
            {locale === "en" ? "Not sure where to start?" : "محتار من أين تبدأ؟"}
          </h2>
          <p className="text-xl text-muted-foreground">
            {locale === "en" 
              ? "Take the 30-second quiz to find your perfect AI partner." 
              : "جرب اختبار الـ 30 ثانية لاكتشاف رفيقك المثالي في الذكاء الاصطناعي."}
          </p>
        </div>
        <AIQuiz locale={locale} />
      </section>

      {/* Professions Grid */}
      <section id="professions" className="container scroll-mt-24">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            {locale === "en" ? "Select Your Profession" : "اختر مهنتك"}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {locale === "en" 
              ? "We provide specialized AI tools for various professional fields." 
              : "نحن نقدم أدوات ذكاء اصطناعي متخصصة لمختلف المجالات المهنية."}
          </p>
        </div>
        
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {professions.map((p) => {
            const Icon = IconMap[p.icon] || Sparkles;
            return (
              <Link
                key={p.id}
                href={`/${locale}/tools/${p.slug}`}
                className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:border-primary hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold">{p.title[locale]}</h3>
                <p className="mt-2 text-muted-foreground">
                  {p.description[locale]}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                  {locale === "en" ? "Explore Tools" : "استكشف الأدوات"}
                  <ArrowRight className={locale === "ar" ? "h-4 w-4 rotate-180" : "h-4 w-4"} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>


      {/* Placeholder for other sections */}
      <section className="container">
        <div className="rounded-3xl bg-muted/50 p-12 text-center border">
          <h2 className="text-3xl font-bold mb-4">
            {locale === "en" ? "Ready to transform your career?" : "هل أنت مستعد لتغيير مسارك المهني؟"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {locale === "en" 
              ? "Join thousands of professionals already using AI Bridge." 
              : "انضم إلى آلاف المحترفين الذين يستخدمون بالفعل جسر الذكاء الاصطناعي."}
          </p>
        </div>
      </section>
    </div>
  );
}
