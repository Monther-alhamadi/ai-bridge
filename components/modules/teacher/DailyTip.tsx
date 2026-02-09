"use client";

import React, { useMemo } from 'react';
import { Sparkles, Lightbulb, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const TIPS = [
  {
    id: 1,
    title: { en: "Active Recall", ar: "الاسترجاع النشط" },
    content: { 
      en: "Try starting your lesson with a 2-minute quick quiz about yesterday's topic to strengthen long-term memory.",
      ar: "جرب بدء درسك باختبار سريع لمدة دقيقتين حول موضوع الأمس لتعزيز الذاكرة طويلة المدى."
    },
    category: "pedagogy"
  },
  {
    id: 2,
    title: { en: "Scaffolding", ar: "السقالات التعليمية" },
    content: { 
      en: "Break complex tasks into smaller, manageable chunks for students who are struggling with new concepts.",
      ar: "قسم المهام المعقدة إلى أجزاء أصغر يمكن إدارتها للطلاب الذين يواجهون صعوبة في المفاهيم الجديدة."
    },
    category: "strategy"
  },
  {
    id: 3,
    title: { en: "Visual Aids", ar: "الوسائل البصرية" },
    content: { 
      en: "Use flowcharts or mind maps when explaining processes to help visual learners grasp the connections.",
      ar: "استخدم المخططات الانسيابية أو الخرائط الذهنية عند شرح العمليات لمساعدة المتعلمين البصريين على فهم الروابط."
    },
    category: "engagement"
  }
];

interface DailyTipProps {
  locale: 'en' | 'ar';
  className?: string;
}

export function DailyTip({ locale, className }: DailyTipProps) {
  const isRTL = locale === 'ar';
  
  // Pick a random tip based on the day of the year (consistent for the whole day)
  const tip = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return TIPS[dayOfYear % TIPS.length];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 p-6 backdrop-blur-sm",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute top-0 right-0 p-16 bg-primary/5 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
      
      <div className="relative z-10 flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
          <Lightbulb className="h-6 w-6 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary/70">
              {locale === 'en' ? 'Daily Pro Tip' : 'نصيحة اليوم الاحترافية'}
            </h4>
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              <Zap className="h-2 w-2" />
              {tip.category.toUpperCase()}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {tip.title[locale]}
          </h3>
          
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {tip.content[locale]}
          </p>
          
          <div className="pt-2">
            <button className="flex items-center gap-1 text-[10px] font-black text-primary hover:gap-2 transition-all uppercase tracking-tighter">
              {locale === 'en' ? 'Learn more about this strategy' : 'تعرف أكثر على هذه الاستراتيجية'}
              <ArrowRight className={cn("h-3 w-3", isRTL && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
