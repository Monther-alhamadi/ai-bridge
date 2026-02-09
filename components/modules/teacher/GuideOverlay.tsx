"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuideOverlayProps {
  locale: "en" | "ar";
}

export function GuideOverlay({ locale }: GuideOverlayProps) {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("has-seen-teacher-tour");
    if (!hasSeenTour) {
      setTimeout(() => setShow(true), 2000); // Wait for page to load
    }
  }, []);

  const steps = [
    {
      title: locale === "ar" ? "أهلاً بك في فصولك!" : "Welcome to your classes!",
      description: locale === "ar" 
        ? "هنا هو مستودعك المركزي. ارفع كتبك وخطط عامك في ثوانٍ." 
        : "This is your central hub. Upload books and plan your year in seconds.",
      target: "subject-store-hub"
    },
    {
      title: locale === "ar" ? "غرفة عملياتك اليومية" : "Your Daily Operations",
      description: locale === "ar"
        ? "الذكاء الاصطناعي يقرأ جدولك ويقترح عليك التحضير المناسب لكل يوم."
        : "AI reads your schedule and suggests the right plan for each day.",
      target: "focus-card-hub"
    },
    {
        title: locale === "ar" ? "جاهز للتميز؟" : "Ready to excel?",
        description: locale === "ar"
          ? "كل شيء تحت السيطرة. ابدأ بتعريف مادتك الأولى الآن."
          : "Everything is under control. Start by defining your first subject now.",
        target: "onboarding-cta"
    }
  ];

  const handleFinish = () => {
    localStorage.setItem("has-seen-teacher-tour", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        />
        
        <div className="relative h-full w-full flex items-center justify-center p-6">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/20 pointer-events-auto relative overflow-hidden"
                dir={locale === "ar" ? "rtl" : "ltr"}
            >
                {/* Glow */}
                <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <button onClick={() => setShow(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Guide Tour</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[10px] text-muted-foreground font-bold">{step + 1} / {steps.length}</span>
                        </div>
                        <h3 className="text-2xl font-black">{steps[step].title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {steps[step].description}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {steps.map((_, i) => (
                            <div key={i} className={cn("h-1 rounded-full transition-all", i === step ? "w-8 bg-primary" : "w-4 bg-primary/20")} />
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {step > 0 && (
                            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="rounded-xl flex-1 h-12">
                                {locale === "ar" ? "السابق" : "Prev"}
                            </Button>
                        )}
                        <Button 
                            onClick={step < steps.length - 1 ? () => setStep(s => s + 1) : handleFinish}
                            className="rounded-xl flex-[2] h-12 font-bold"
                        >
                            {step < steps.length - 1 ? (locale === "ar" ? "التالي" : "Next") : (locale === "ar" ? "فهمت!" : "Got it!")}
                            <ArrowRight className={cn("ml-2 h-4 w-4", locale === "ar" && "mr-2 ml-0 rotate-180")} />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
