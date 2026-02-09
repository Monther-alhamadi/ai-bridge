"use client";

import { useState, useRef } from "react";
import { FileText, Sliders, RefreshCw, Lock, Upload, Plus, Minus, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { PROMPT_FACTORY, ToolPromptParams } from "@/config/prompts";

interface ModularParametricToolProps {
  locale: "en" | "ar";
  profession: string;
  toolSlug: string;
}

export function ModularParametricTool({ locale, profession, toolSlug }: ModularParametricToolProps) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(50);
  const [count, setCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setTopic(locale ==='en' ? `Analyzing contents of ${file.name}...` : `تحليل محتويات ${file.name}...`);
      trackEvent("begin_checkout", { item_name: "file_uploaded", context: toolSlug });
    }
  };

  const handleGenerate = () => {
    if (!topic) return;
    setIsGenerating(true);
    
    // Get the Factory Path
    const factory = (PROMPT_FACTORY as any)[profession]?.[toolSlug];
    if (!factory) {
        setResult("Tool logic not yet implemented in Prompt Factory.");
        setIsGenerating(false);
        return;
    }

    const engineeredPrompt = factory({
        topic,
        difficulty,
        count,
        language: locale,
        context: fileName ? `Source File: ${fileName}` : undefined
    });

    // console.log("PARAMETRIC REQUEST:", engineeredPrompt);

    // Simulate AI Generation
    setTimeout(() => {
      setResult(locale === 'ar' 
        ? `بناءً على المعايير البارامترية (الصعوبة: ${difficulty}%، العدد: ${count}):\n\nلقد قمت بتحليل ${topic.substring(0, 30)}... وقمت بصياغة استراتيجية احترافية تضمن لك التميز. هذه النسخة هي معاينة أولية مبنية على سياق ${fileName || 'المدخلات النصية'}.`
        : `Based on your parametric settings (Difficulty: ${difficulty}%, Count: ${count}):\n\nI have analyzed ${topic.substring(0, 30)}... and drafted a professional strategy tailored for your needs. This is a preview version based on ${fileName || 'your text input'}.`);
      
      setIsGenerating(false);
      trackEvent("outcome_view", { item_name: toolSlug + "_generated", context: toolSlug });
    }, 2000);
  };

  return (
    <div className="rounded-3xl border bg-card shadow-xl overflow-hidden relative">
      <div className="bg-primary/5 p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg text-primary-foreground">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl capitalize">{toolSlug.replace(/-/g, ' ')}</h3>
            <p className="text-sm text-muted-foreground">{locale === "en" ? "Precision-controlled AI logic." : "منطق ذكاء اصطناعي محكوم بدقة."}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-0">
        <div className="lg:col-span-5 p-6 space-y-8 border-e bg-muted/5">
          <div className="space-y-4">
            <label className="text-sm font-black uppercase text-muted-foreground">{locale === "en" ? "Input Context" : "سياق الإدخال"}</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-primary/5",
                fileName ? "border-green-500 bg-green-50/30" : "border-muted-foreground/20"
              )}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <Upload className={cn("h-8 w-8 mx-auto mb-2", fileName ? "text-green-500" : "text-muted-foreground")} />
              <p className="font-bold text-sm tracking-tighter">{fileName || (locale === "en" ? "Upload Reference File" : "ارفع ملف مرجعي")}</p>
            </div>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={locale === "en" ? "Specific questions or project details..." : "أسئلة محددة أو تفاصيل المشروع..."}
              className="w-full rounded-xl border bg-background p-4 text-sm focus:ring-2 ring-primary/20 min-h-[120px]"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-black text-muted-foreground uppercase">{locale === "en" ? "Complexity" : "درجة التعقيد"}</label>
                    <span className="text-primary font-black">{difficulty}%</span>
                </div>
                <input type="range" min="0" max="100" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} className="w-full h-2 accent-primary bg-muted rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="space-y-3">
                <label className="text-xs font-black text-muted-foreground uppercase">{locale === "en" ? "Output Count / Volume" : "حجم المخرجات"}</label>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCount(Math.max(1, count - 1))} className="p-2 border rounded-lg"><Minus className="h-4 w-4" /></button>
                    <span className="flex-grow text-center font-bold border rounded-lg py-2">{count}</span>
                    <button onClick={() => setCount(count + 1)} className="p-2 border rounded-lg"><Plus className="h-4 w-4" /></button>
                </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic || isGenerating}
            className="w-full rounded-2xl bg-primary py-4 font-black text-primary-foreground shadow-lg hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {isGenerating ? <RefreshCw className="h-6 w-6 animate-spin" /> : <><Send className="h-5 w-5" /> {locale === "en" ? "Execute AI Logic" : "تنفيذ المنطق الذكي"}</>}
          </button>
        </div>

        <div className="lg:col-span-7 p-6 bg-background relative flex flex-col">
          <div className="flex-grow border rounded-2xl bg-muted/20 p-6 md:p-10 shadow-inner relative overflow-y-auto max-h-[500px]">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-6 opacity-30 mt-10">
                <FileText className="h-20 w-20" />
                <p className="font-bold">{locale === "en" ? "Awaiting your parametric settings..." : "بانتظار إعداداتك البارامترية..."}</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none animate-in fade-in duration-500">
                <p className="whitespace-pre-wrap leading-loose text-base font-medium">{result}</p>
                <div className="mt-8 pt-8 border-t flex justify-center">
                    <button onClick={() => setShowPaywall(true)} className="bg-primary/10 text-primary border border-primary/20 px-8 py-3 rounded-xl font-bold hover:bg-primary/20 transition-all">
                        {locale === 'en' ? 'Unlock Professional Strategy' : 'افتح الاستراتيجية الاحترافية كاملة'}
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPaywall && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl p-6">
          <div className="bg-card w-full max-w-md p-10 rounded-[2.5rem] border shadow-2xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary rotate-12"><Lock className="h-8 w-8" /></div>
            <h3 className="text-2xl font-black">{locale === "en" ? "Pro Access Required" : "مطلوب حساب احترافي"}</h3>
            <p className="text-muted-foreground text-sm">{locale === "en" ? "Unlimited precision tools, file analysis, and professional advisory exports." : "أدوات دقيقة غير محدودة، تحليل ملفات، وتصدير كامل للاستشارات الاحترافية."}</p>
            <Link href={`/${locale}/pricing`} className="block w-full rounded-2xl bg-primary py-4 font-black text-primary-foreground shadow-lg">{locale === "en" ? "Upgrade Now" : "اشترك الآن"}</Link>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-muted-foreground underline">{locale === "en" ? "Close" : "إغلاق"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
