"use client";

import { Video, UserCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { cn } from "@/lib/utils";

interface ContentCreatorModuleProps {
  locale: "en" | "ar";
}

const TOOLS = [
  {
    id: "script-writer",
    title: { en: "Viral Script Writer", ar: "كاتب السيناريو الفيروسي" },
    description: { en: "Generate high-retention scripts for TikTok, Reels, and YouTube.", ar: "أنشئ سيناريوهات ذات احتفاظ عالي للمشاهدة لتيك توك وريلز ويوتيوب." },
    icon: Video,
    color: "bg-red-500",
    slug: "script-writer"
  },
  {
    id: "career-assistant",
    title: { en: "Creator Growth Assistant", ar: "مساعد نمو صناع المحتوى" },
    description: { en: "Strategies to build your personal brand and increase engagement.", ar: "استراتيجيات لبناء علامتك التجارية الشخصية وزيادة التفاعل." },
    icon: UserCircle,
    color: "bg-purple-500",
    slug: "career-assistant"
  }
];

export function ContentCreatorModule({ locale }: ContentCreatorModuleProps) {
  return (
    <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
        <div className="space-y-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest">
                Creator Suite
            </Badge>
            <h2 className="text-3xl font-black">{locale === 'en' ? 'Creator OS' : 'نظام تشغيل صانع المحتوى'}</h2>
            <p className="text-muted-foreground">{locale === 'en' ? 'Select your precision production tool below.' : 'اختر أداة الإنتاج الدقيقة من الأسفل.'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
                key={tool.id}
                href={`/${locale}/tools/content-creator/${tool.slug}`}
                className="group relative overflow-hidden rounded-3xl border bg-card p-8 transition-all hover:border-primary hover:shadow-xl flex flex-col h-full"
            >
              <div className={cn("inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white mb-6 shadow-lg transition-transform group-hover:scale-110", tool.color)}>
                 <Icon className="h-7 w-7" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{tool.title[locale]}</h3>
              <p className="text-base text-muted-foreground flex-grow leading-relaxed">{tool.description[locale]}</p>
              
              <div className="mt-8 flex items-center gap-2 text-sm font-black text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 uppercase tracking-tighter">
                {locale === 'en' ? 'Start Production' : 'ابدأ الإنتاج'}
                <ArrowRight className={`h-4 w-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
