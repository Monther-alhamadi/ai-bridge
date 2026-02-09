"use client";

import { useState, useRef } from "react";
import { FileText, Sliders, Printer, RefreshCw, Lock, CheckCircle2, AlertCircle, Upload, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { PROMPT_FACTORY } from "@/config/prompts";

interface ExamGeneratorProps {
  locale: "en" | "ar";
}

export function ExamGenerator({ locale }: ExamGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState(50);
  const [mcqCount, setMcqCount] = useState(5);
  const [essayCount, setEssayCount] = useState(0);
  const [trueFalseCount, setTrueFalseCount] = useState(5);
  const [fillBlanksCount, setFillBlanksCount] = useState(0);
  const [matchingCount, setMatchingCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // In a real app, you'd extract text from the PDF here
      setTopic(`[EXTRACTED FROM ${file.name}]...`);
      trackEvent("begin_checkout", { item_name: "file_uploaded", context: "exam_engine" });
    }
  };

  const handleGenerate = () => {
    if (!topic) return;
    setIsGenerating(true);
    
    // BUILD THE ENGINEERED PROMPT
    const engineeredPrompt = PROMPT_FACTORY.teacher["exam-generator"]({
        topic,
        difficulty,
        mcqCount,
        essayCount,
        trueFalseCount,
        fillBlanksCount,
        matchingCount,
        language: locale,
        context: fileName ? `Source: ${fileName}` : undefined
    });

    // console.log("SENDING TO AI:", engineeredPrompt);

    // Simulate AI Generation
    setTimeout(() => {
      setGeneratedExam(`EXAM DRAFT: ${topic.substring(0, 30)}...
----------------------------------------
Difficulty: ${difficulty > 70 ? "Hard" : difficulty < 30 ? "Easy" : "Medium"}
Total Questions: ${mcqCount + essayCount + trueFalseCount}

[Section 1: Multiple Choice (${mcqCount} Questions)]
${Array.from({ length: mcqCount }).map((_, i) => `${i + 1}. [Machine generated question based on precision prompts...]`).join("\n")}

[Section 2: True/False (${trueFalseCount} Questions)]
${Array.from({ length: trueFalseCount }).map((_, i) => `${i + 1}. [T/F Statement about ${topic.substring(0, 20)}...]`).join("\n")}

[Section 3: Essay Questions (${essayCount} Questions)]
${Array.from({ length: essayCount }).map((_, i) => `${i + 1}. Discuss the impact of...`).join("\n")}

----------------------------------------
[PRO TIP: Upgrade to unlock full Word export and Answer Key]
`);
      setIsGenerating(false);
      trackEvent("outcome_view", { item_name: "exam_generated", context: "exam_engine", diff: difficulty });
    }, 2000);
  };

  return (
    <div id="exam-engine" className="rounded-3xl border bg-card shadow-xl overflow-hidden scroll-mt-24 relative">
      <div className="bg-primary/5 p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg text-primary-foreground">
            <Sliders className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl">{locale === "en" ? "Parametric Exam Generator" : "مولد الاختبارات البارامتري"}</h3>
            <p className="text-sm text-muted-foreground">{locale === "en" ? "Precision-engineered AI control panel." : "لوحة تحكم ذكية للهندسة الدقيقة للاختبارات."}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-0">
        
        {/* Controls (Left Panel) */}
        <div className="lg:col-span-5 p-6 space-y-8 border-e bg-muted/5">
          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">
                {locale === "en" ? "1. Source Data (Text or File)" : "1. مصدر البيانات (نص أو ملف)"}
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-primary/5 hover:border-primary",
                fileName ? "border-green-500 bg-green-50/30" : "border-muted-foreground/20"
              )}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt"
              />
              <Upload className={cn("h-8 w-8 mx-auto mb-2", fileName ? "text-green-500" : "text-muted-foreground")} />
              <p className="font-bold text-sm">
                {fileName ? fileName : (locale === "en" ? "Upload PDF / Document" : "ارفع ملف PDF أو مستند نصي")}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {locale === "en" ? "Or paste content below" : "أو الصق المحتوى في الأسفل"}
              </p>
            </div>
            
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={locale === "en" ? "Key topics, textbook chapters, or raw notes..." : "المواضيع الأساسية، فصول الكتاب، أو ملاحظات..."}
              className="w-full rounded-xl border bg-background p-4 text-sm focus:ring-2 ring-primary/20 min-h-[120px]"
            />
          </div>

          {/* Precision Sliders */}
          <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-black text-muted-foreground uppercase">{locale === "en" ? "Difficulty Level" : "مستوى الصعوبة"}</label>
                    <span className="text-primary font-black">{difficulty}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
            </div>

            {/* Counters */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-xs font-black text-muted-foreground uppercase">{locale === 'ar' ? 'اختيار من متعدد' : 'MCQ Count'}</label>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setMcqCount(Math.max(1, mcqCount - 1))} className="p-2 border rounded-lg hover:bg-muted"><Minus className="h-4 w-4" /></button>
                        <span className="flex-grow text-center font-bold border rounded-lg py-2">{mcqCount}</span>
                        <button onClick={() => setMcqCount(mcqCount + 1)} className="p-2 border rounded-lg hover:bg-muted"><Plus className="h-4 w-4" /></button>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-muted-foreground uppercase">{locale === 'ar' ? 'صح أو خطأ' : 'T/F Count'}</label>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setTrueFalseCount(Math.max(0, trueFalseCount - 1))} className="p-2 border rounded-lg hover:bg-muted"><Minus className="h-4 w-4" /></button>
                        <span className="flex-grow text-center font-bold border rounded-lg py-2">{trueFalseCount}</span>
                        <button onClick={() => setTrueFalseCount(trueFalseCount + 1)} className="p-2 border rounded-lg hover:bg-muted"><Plus className="h-4 w-4" /></button>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-muted-foreground uppercase">{locale === 'ar' ? 'أسئلة مقالية' : 'Essay Count'}</label>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setEssayCount(Math.max(0, essayCount - 1))} className="p-2 border rounded-lg hover:bg-muted"><Minus className="h-4 w-4" /></button>
                        <span className="flex-grow text-center font-bold border rounded-lg py-2">{essayCount}</span>
                        <button onClick={() => setEssayCount(essayCount + 1)} className="p-2 border rounded-lg hover:bg-muted"><Plus className="h-4 w-4" /></button>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-muted-foreground uppercase">{locale === 'ar' ? 'إكمال فراغ' : 'Fill Blanks'}</label>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setFillBlanksCount(Math.max(0, fillBlanksCount - 1))} className="p-2 border rounded-lg hover:bg-muted"><Minus className="h-4 w-4" /></button>
                        <span className="flex-grow text-center font-bold border rounded-lg py-2">{fillBlanksCount}</span>
                        <button onClick={() => setFillBlanksCount(fillBlanksCount + 1)} className="p-2 border rounded-lg hover:bg-muted"><Plus className="h-4 w-4" /></button>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-muted-foreground uppercase">{locale === 'ar' ? 'توصيل / مزاوجة' : 'Matching'}</label>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setMatchingCount(Math.max(0, matchingCount - 1))} className="p-2 border rounded-lg hover:bg-muted"><Minus className="h-4 w-4" /></button>
                        <span className="flex-grow text-center font-bold border rounded-lg py-2">{matchingCount}</span>
                        <button onClick={() => setMatchingCount(matchingCount + 1)} className="p-2 border rounded-lg hover:bg-muted"><Plus className="h-4 w-4" /></button>
                    </div>
                </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic || isGenerating}
            className="w-full rounded-2xl bg-primary py-4 font-black text-primary-foreground shadow-2xl hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
          >
            {isGenerating ? (
              <RefreshCw className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <FileText className="h-6 w-6" />
                {locale === "en" ? "Engineer Exam" : "هندسة الاختبار"}
              </>
            )}
          </button>
        </div>

        {/* Live Preview (Right Panel) */}
        <div className="lg:col-span-7 p-6 bg-background relative flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Engine Feed
             </div>
             {generatedExam && (
                 <button onClick={() => setShowPaywall(true)} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                    <Printer className="h-3 w-3" />
                    {locale === 'en' ? 'Export High Quality' : 'تصدير بجودة عالية'}
                 </button>
             )}
          </div>

          <div className="flex-grow border rounded-2xl bg-muted/20 p-6 md:p-10 font-serif overflow-y-auto max-h-[600px] shadow-inner relative">
            {!generatedExam ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-6 opacity-30">
                <FileText className="h-20 w-20" />
                <div className="space-y-3 w-full max-w-[300px]">
                    <div className="h-3 bg-muted rounded-full w-full animate-pulse" />
                    <div className="h-3 bg-muted rounded-full w-4/5 animate-pulse" />
                    <div className="h-3 bg-muted rounded-full w-2/3 animate-pulse" />
                </div>
                <p className="font-bold">{locale === "en" ? "Awaiting parametric inputs..." : "بانتظار المدخلات البرمجية..."}</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none animate-in fade-in duration-500">
                <pre className="whitespace-pre-wrap font-inherit text-foreground leading-loose text-base">
                    {generatedExam}
                </pre>
                
                {/* Simulated Watermark */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end justify-center pb-8 p-6 text-center">
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-muted-foreground">
                            {locale === 'en' ? 'Showing truncated preview version' : 'عرض نسخة معاينة مصغرة'}
                        </p>
                        <button 
                            onClick={() => setShowPaywall(true)}
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-black shadow-lg hover:scale-105 transition-all text-sm uppercase tracking-tighter"
                        >
                            {locale === 'en' ? 'Unlock Professional Word/PDF' : 'افتح النسخة الكاملة Word/PDF'}
                        </button>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paywall Overlay */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl p-4 transition-all">
          <div className="bg-card w-full max-w-lg p-10 rounded-[3rem] border-4 border-primary/20 shadow-2xl text-center space-y-8">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary rotate-12">
              <Lock className="h-10 w-10" />
            </div>
            
            <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tighter">
                    {locale === "en" ? "Unlock the Full Engine" : "افتح المحرك الكامل"}
                </h3>
                <p className="text-muted-foreground text-lg px-4">
                    {locale === "en" 
                        ? "Get professional formatting, full Answer Key, and unlimited exports to Word and PDF." 
                        : "احصل على تنسيق احترافي، مفتاح إجابة كامل، وتصدير غير محدود بصيغ Word و PDF."}
                </p>
            </div>

            <Link 
              href={`/${locale}/pricing`}
              className="block w-full rounded-[2rem] bg-primary py-5 text-xl font-black text-primary-foreground shadow-[0_10px_40px_-10px_rgba(var(--primary),0.5)] hover:bg-primary/90 transition-all active:scale-95"
            >
              {locale === "en" ? "Continue for $9.99" : "استمرار مقابل 9.99$"}
            </Link>
            
            <button 
              onClick={() => setShowPaywall(false)}
              className="font-bold text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              {locale === "en" ? "Back to Editor" : "العودة للمحرر"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
