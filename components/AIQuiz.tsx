"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Share2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface AIQuizProps {
  locale: "en" | "ar";
}

const QUESTIONS = [
  {
    id: 1,
    text: { en: "What is your main goal?", ar: "ما هو هدفك الرئيسي؟" },
    options: [
      { id: "art", text: { en: "Create Digital Art", ar: "إنشاء فن رقمي" } },
      { id: "code", text: { en: "Write Better Code", ar: "كتابة أكواد برمجية" } },
      { id: "write", text: { en: "Content & Research", ar: "كتابة محتوى وأبحاث" } },
    ]
  },
  {
    id: 2,
    text: { en: "What is your experience level?", ar: "ما هو مستوى خبرتك؟" },
    options: [
      { id: "beginner", text: { en: "Beginner", ar: "مبتدئ" } },
      { id: "pro", text: { en: "Professional", ar: "محترف" } },
    ]
  },
  {
    id: 3,
    text: { en: "What is your budget?", ar: "ما هي ميزانيتك؟" },
    options: [
      { id: "free", text: { en: "Free / Low Cost", ar: "مجاني / منخفض" } },
      { id: "paid", text: { en: "Premium Quality", ar: "جودة عالية (مدفوع)" } },
    ]
  }
];

// Simple matchmaking logic
const RECOMMENDATIONS: Record<string, any> = {
  "art-paid": { name: "Midjourney v6", slug: "midjourney-v6", desc: "The unrivaled king of AI art.", link: "/go/midjourney-v6" },
  "art-free": { name: "Bing Image Creator", slug: "bing", desc: "Great DALL-E 3 art for free.", link: "/go/bing" },
  "code-paid": { name: "Cursor AI", slug: "cursor-ai", desc: "The AI code editor of the future.", link: "/go/cursor-ai" },
  "code-free": { name: "GitHub Copilot", slug: "github-copilot", desc: "Industry standard for completion.", link: "/go/github-copilot" }, // Copilot isn't free but often has trials, good fallback
  "write-paid": { name: "Claude 3 Opus", slug: "claude", desc: "Best-in-class reasoning & writing.", link: "/go/claude" },
  "write-free": { name: "ChatGPT 3.5", slug: "chatgpt", desc: "The versatile daily assistant.", link: "/go/chatgpt" },
};

export function AIQuiz({ locale }: AIQuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<any>(null);

  const handleAnswer = (questionId: number, optionId: string) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate Result
      const key = `${newAnswers[1]}-${newAnswers[3]}`; // goal-budget
      const match = RECOMMENDATIONS[key] || RECOMMENDATIONS["write-free"];
      setResult(match);
      trackEvent("outcome_view", {
        item_name: match.name,
        context: "ai_quiz_result"
      });
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const shareResult = () => {
    const text = locale === "en" 
      ? `I just found my AI digital twin: ${result.name}! Find yours here:` 
      : `لقد اكتشفت توأمي الرقمي في الذكاء الاصطناعي: ${result.name}! اكتشف أداتك هنا:`;
    const url = "https://ai-bridge.com"; // Replace with real domain
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-[2.5rem] border bg-gradient-to-br from-card to-background p-8 shadow-2xl md:p-12 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl -z-10" />
      
      {!result ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {locale === "en" ? `Question ${step + 1}/${QUESTIONS.length}` : `سؤال ${step + 1}/${QUESTIONS.length}`}
            </span>
            <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-black md:text-4xl leading-tight">
                {QUESTIONS[step].text[locale]}
              </h3>

              <div className="grid gap-4">
                {QUESTIONS[step].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(QUESTIONS[step].id, option.id)}
                    className="flex w-full items-center justify-between rounded-xl border bg-background p-6 text-left text-lg font-bold transition-all hover:border-primary hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]"
                  >
                    {option.text[locale]}
                    <ArrowRight className={cn("h-5 w-5 text-muted-foreground", locale === "ar" && "rotate-180")} />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        // Result View
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-8"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
            <Sparkles className="h-10 w-10 text-green-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {locale === "en" ? "Your Perfect AI Match" : "أداتك المثالية هي"}
            </h2>
            <h1 className="text-4xl font-black md:text-5xl text-primary">
              {result.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              {result.desc}
            </p>
          </div>

          <div className="grid gap-4 max-w-sm mx-auto">
            <Link
              href={result.link}
              target="_blank"
              onClick={() => trackEvent("affiliate_click", { item_name: result.name, context: "quiz_result" })}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95 animate-pulse"
            >
              {locale === "en" ? "Get It Now" : "احصل عليها الآن"}
              <ArrowRight className={cn(locale === "ar" && "rotate-180")} />
            </Link>

            <button
              onClick={shareResult}
              className="flex items-center justify-center gap-2 rounded-xl border bg-background px-8 py-4 font-bold transition-colors hover:bg-muted text-sky-500"
            >
              <Share2 className="h-5 w-5" />
              {locale === "en" ? "Share Result" : "شارك النتيجة"}
            </button>
          </div>

          <button
            onClick={resetQuiz}
            className="text-sm text-muted-foreground hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <RotateCcw className="h-3 w-3" />
            {locale === "en" ? "Retake Quiz" : "إعادة الاختبار"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
