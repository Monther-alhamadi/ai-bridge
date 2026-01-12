"use client";

import { useState } from "react";
import { FileText, Sliders, Printer, RefreshCw, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface ExamGeneratorProps {
  locale: "en" | "ar";
}

export function ExamGenerator({ locale }: ExamGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(50);
  const [mcqCount, setMcqCount] = useState(5);
  const [essayCount, setEssayCount] = useState(2);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleGenerate = () => {
    if (!topic) return;
    setIsGenerating(true);
    
    // Simulate AI Generation
    setTimeout(() => {
      setGeneratedExam(`EXAM DRAFT: ${topic}
----------------------------------------
Difficulty: ${difficulty > 70 ? "Hard" : difficulty < 30 ? "Easy" : "Medium"}
Total Questions: ${mcqCount + essayCount}

[Section 1: Multiple Choice]
${Array.from({ length: mcqCount }).map((_, i) => `${i + 1}. [Machine generated question about ${topic}...]`).join("\n")}

[Section 2: Essay Questions]
${Array.from({ length: essayCount }).map((_, i) => `${i + 1}. Discuss the impact of ${topic} on...`).join("\n")}

${includeAnswerKey ? `\n[ANSWER KEY - PRO FEATURE]\n1. A\n2. C...` : ""}
`);
      setIsGenerating(false);
      trackEvent("outcome_view", { item_name: "exam_generated", context: "exam_engine" });
    }, 1500);
  };

  const handleExport = () => {
    trackEvent("begin_checkout", { item_name: "export_exam_pdf", context: "exam_engine" });
    setShowPaywall(true);
  };

  return (
    <div id="exam-engine" className="rounded-3xl border bg-card shadow-xl overflow-hidden scroll-mt-24">
      <div className="bg-primary/5 p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg text-primary-foreground">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl">{locale === "en" ? "Exam Engine AI" : "محرك الاختبارات الذكي"}</h3>
            <p className="text-sm text-muted-foreground">{locale === "en" ? "Create professional exams in seconds." : "أنشئ اختبارات احترافية في ثوانٍ."}</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
             {locale === "en" ? "Beta v1.0" : "نسخة تجريبية"}
           </span>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-0">
        
        {/* Controls (Left Panel) */}
        <div className="md:col-span-4 p-6 space-y-8 border-e bg-muted/10">
          <div className="space-y-4">
            <label className="text-sm font-bold">{locale === "en" ? "Exam Topic / Text" : "موضوع الاختبار أو النص"}</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={locale === "en" ? "Paste text or type topic..." : "الصق النص أو اكتب الموضوع..."}
              className="w-full rounded-xl border bg-background p-3 focus:ring-2 ring-primary/20 min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold flex justify-between">
              {locale === "en" ? "Difficulty" : "مستوى الصعوبة"}
              <span className="text-primary">{difficulty}%</span>
            </label>
            <input 
              type="range" 
              min="0" max="100" 
              value={difficulty} 
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Easy</span>
              <span>Medium</span>
              <span>Hard</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase text-muted-foreground">MCQ Output</label>
               <input 
                 type="number" 
                 value={mcqCount}
                 onChange={(e) => setMcqCount(Number(e.target.value))}
                 className="w-full rounded-lg border bg-background p-2"
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold uppercase text-muted-foreground">Essay Output</label>
               <input 
                 type="number" 
                 value={essayCount}
                 onChange={(e) => setEssayCount(Number(e.target.value))}
                 className="w-full rounded-lg border bg-background p-2"
               />
             </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border bg-background">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-bold">{locale === "en" ? "Answer Key" : "مفتاح الإجابة"}</span>
            </div>
            <input 
              type="checkbox" 
              checked={includeAnswerKey}
              onChange={(e) => setIncludeAnswerKey(e.target.checked)}
              className="h-5 w-5 accent-primary rounded cursor-pointer"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic || isGenerating}
            className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground shadow-lg hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              locale === "en" ? "Generate Exam" : "توليد الاختبار"
            )}
          </button>
        </div>

        {/* Live Preview (Right Panel) */}
        <div className="md:col-span-8 p-8 bg-background relative min-h-[500px]">
          <div className="absolute top-4 right-4 flex gap-2">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               Live Preview
             </div>
          </div>

          <div className="prose prose-sm max-w-none mt-8 p-8 border rounded-xl shadow-sm bg-white min-h-[400px]">
            {!generatedExam ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-50 mt-20">
                <FileText className="h-16 w-16" />
                <p>{locale === "en" ? "Enter details to see the magic..." : "أدخل التفاصيل لترى السحر..."}</p>
                {/* Live Structure Preview */}
                <div className="w-full max-w-[200px] space-y-2">
                   <div className="h-2 w-full bg-muted rounded" />
                   <div className="h-2 w-3/4 bg-muted rounded" />
                   <div className="h-2 w-1/2 bg-muted rounded" />
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-serif text-base">{generatedExam}</pre>
            )}
          </div>
          
          {/* Actions */}
          {generatedExam && (
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={handleGenerate}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {locale === "en" ? "Regenerate" : "إعادة المحاولة"}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:scale-105 transition-transform"
              >
                <Printer className="h-4 w-4" />
                {locale === "en" ? "Print / Export PDF" : "طباعة / تصدير PDF"}
              </button>
            </div>
          )}

          {/* Paywall Overlay */}
          {showPaywall && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-card w-full max-w-md p-8 rounded-3xl border shadow-2xl space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black">
                  {locale === "en" ? "Unlock Professional Export" : "افتح ميزة التصدير الاحترافي"}
                </h3>
                <p className="text-muted-foreground">
                  {locale === "en" 
                    ? "You just saved ~2 hours of work! Get this exam in Word format with your school logo + Answer Key." 
                    : "لقد وفرت حوالي ساعتين من العمل! احصل على الاختبار بصيغة Word مع شعار مدرستك + مفتاح الإجابة."}
                </p>
                <Link 
                  href={`/${locale}/pricing`}
                  className="block w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground shadow-lg hover:scale-[1.02] transition-transform"
                >
                  {locale === "en" ? "Upgrade Now" : "رقي حسابك الآن"}
                </Link>
                <button 
                  onClick={() => setShowPaywall(false)}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {locale === "en" ? "Keep editing" : "تعديل المراجعة"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
