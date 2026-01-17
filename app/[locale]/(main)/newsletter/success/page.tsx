"use client";

import { useEffect } from "react";
import { CheckCircle, ArrowRight, Sparkles, BookOpen, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NewsletterSuccessPage() {
  const params = useParams();
  const locale = params.locale as "ar" | "en";
  const isRTL = locale === "ar";

  const content = {
    en: {
      title: "Congratulations!",
      subtitle: "You are now part of the future of education 🚀",
      description: "Check your email now to download the '50 Magic Prompts Guide' we promised you.",
      cta: "Try the Smart Lesson Planner Now",
      back: "Back to News",
    },
    ar: {
      title: "تهانينا!",
      subtitle: "أنت الآن جزء من مستقبل التعليم 🚀",
      description: "تفقد بريدك الإلكتروني الآن لتحميل 'دليل الـ 50 برومبت سحري' الذي وعدناك به.",
      cta: "جرب أداة تحضير الدروس الذكية الآن",
      back: "العودة للأخبار",
    }
  };

  const t = content[locale] || content.en;

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full"
        />
      </div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
          "relative max-w-2xl w-full p-8 md:p-12 rounded-[2.5rem] border border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] text-center",
          isRTL ? "rtl" : "ltr"
        )}
      >
        {/* Success Icon with Spring Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.4 
          }}
          className="mx-auto w-24 h-24 mb-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 shadow-lg shadow-green-500/20 shadow-emerald-400/20"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        {/* Text Content */}
        <div className="space-y-4 mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent"
          >
            {t.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl font-bold text-primary"
          >
            {t.subtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-start gap-4 p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/20 shadow-sm"
          >
            <Sparkles className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <p className="text-lg text-muted-foreground leading-relaxed text-start">
              {t.description}
            </p>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              href={`/${locale}/tools/teacher`}
              className="group relative w-full inline-flex items-center justify-center gap-3 bg-primary text-white text-lg font-black px-8 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Zap className="w-6 h-6 fill-current" />
              {t.cta}
              <ArrowRight className={cn("w-6 h-6 transition-transform group-hover:translate-x-1", isRTL && "rotate-180 group-hover:-translate-x-1")} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <BookOpen className="w-4 h-4" />
              {t.back}
            </Link>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm -z-10">
          <Sparkles className="w-32 h-32 text-primary" />
        </div>
        <div className="absolute bottom-0 left-0 p-8 opacity-10 blur-sm -z-10">
          <Zap className="w-32 h-32 text-secondary" />
        </div>
      </motion.div>
    </div>
  );
}
