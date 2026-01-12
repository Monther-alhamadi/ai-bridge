"use client";

import { Briefcase, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { cn } from "@/lib/utils";

interface BusinessOwnerModuleProps {
  locale: "en" | "ar";
}

const TOOLS = [
  {
    id: "smart-consultant",
    title: { en: "Smart Business Consultant", ar: "المستشار التجاري الذكي" },
    description: { en: "Analyze business models, profitability, and operational efficiency.", ar: "حلل نماذج الأعمال، الربحية، وكفاءة العمليات التشغيلية." },
    icon: Briefcase,
    color: "bg-indigo-600",
    slug: "smart-consultant"
  }
];

export function BusinessOwnerModule({ locale }: BusinessOwnerModuleProps) {
  return (
    <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
        <div className="space-y-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest">
                Business Intelligence
            </Badge>
            <h2 className="text-3xl font-black">{locale === 'en' ? 'Business OS' : 'نظام تشغيل الأعمال'}</h2>
            <p className="text-muted-foreground">{locale === 'en' ? 'Professional advisory control panels.' : 'لوحات تحكم استشارية احترافية.'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto md:mx-0">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
                key={tool.id}
                href={`/${locale}/tools/business-owner/${tool.slug}`}
                className="group relative overflow-hidden rounded-3xl border bg-card p-10 transition-all hover:border-primary hover:shadow-2xl flex flex-col h-full bg-gradient-to-br from-card to-muted/20"
            >
              <div className={cn("inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white mb-8 shadow-xl transition-transform group-hover:scale-110", tool.color)}>
                 <Icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors">{tool.title[locale]}</h3>
              <p className="text-lg text-muted-foreground flex-grow leading-relaxed">{tool.description[locale]}</p>
              
              <div className="mt-10 flex items-center gap-2 text-base font-black text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 uppercase tracking-tighter">
                {locale === 'en' ? 'Open Strategy Panel' : 'افتح لوحة الاستراتيجية'}
                <ArrowRight className={`h-5 w-5 ${locale === 'ar' ? 'rotate-180' : ''}`} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
