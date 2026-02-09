"use client"


import React, { useState, useEffect } from 'react';
import { ToolPanel, ProgressBar } from './shared/ToolPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDrafts } from '@/lib/hooks/use-drafts';
import { useSearchParams } from 'next/navigation';
import { useCurriculum } from '@/lib/hooks/use-curriculum-context';
import { db } from '@/lib/db';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Minus,
  Timer,
  Target,
  Upload,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/Badge';
import { AffiliateManager } from '@/lib/affiliate-manager';
import { MagicLoader } from '@/components/ui/MagicLoader';
import { triggerConfetti } from '@/lib/confetti';


interface LessonPlannerProps {
  locale: 'en' | 'ar';
  profession?: string;
  toolSlug?: string;
}

export function LessonPlanner({ locale, profession, toolSlug }: LessonPlannerProps) {
  const isRTL = locale === 'ar';
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [output, setOutput] = useState<any>(null);

  const strategyOptions = [
    { value: 'active', labelEn: 'Active Learning', labelAr: 'التعلم النشط' },
    { value: 'brainstorm', labelEn: 'Brainstorming', labelAr: 'العصف الذهني' },
    { value: 'inquiry', labelEn: 'Inquiry-Based', labelAr: 'التعلم الاستقصائي' },
  ];

  const initialParams = {
    subject: '',
    grade: '',
    objectives: '',
    strategies: [] as string[],
    duration: '45',
    model: '5E Model',
    differentiation: true
  };

  const { textbooks, lessons, activeTextbookId, setActiveTextbookId } = useCurriculum();
  const activeBook = textbooks?.find(t => t.id === activeTextbookId);
  
  const searchParams = useSearchParams();
  const lessonIdParam = searchParams.get('lessonId');
  const autoPlan = searchParams.get('auto') === 'true';
  
  const handleExport = async () => {
    const element = document.getElementById('lesson-plan-output');
    if (!element) return;

    const opt = {
      margin:       [15, 10, 15, 10] as [number, number, number, number],
      filename:     `${output?.title || 'Lesson_Plan'}_AI_Bridge.pdf`,
      image:        { type: 'jpeg' as const, quality: 1.0 },
      html2canvas:  { scale: 3, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set(opt).from(element).save();
  };

  const [params, setParams, isLoaded] = useDrafts('teacher-lesson-planner', initialParams);
  
  // Auto-fill from Context Injection
  // Auto-fill from Context Injection (Direct DB Fetch to bypass Active Book scope)
  useEffect(() => {
    const loadLessonContext = async () => {
        if (!lessonIdParam || !isLoaded) return;
        
        try {
            const lessonId = parseInt(lessonIdParam);
            const lesson = await db.lessons.get(lessonId);
            
            if (lesson) {
                // 1. Force Switch Active Book
                if (lesson.textbookId !== activeTextbookId) {
                    setActiveTextbookId(lesson.textbookId);
                }

                // 2. Fetch Textbook details for metadata
                const textbook = await db.textbooks.get(lesson.textbookId);
                
                // 3. Update Params
                // Smart Context Fallback: If context is generic (from TOC regex), use the Title as the primary directive
                const isGenericContext = !lesson.contentContext || lesson.contentContext.includes('Extracted') || lesson.contentContext.length < 20;
                const effectiveObjectives = isGenericContext 
                    ? `Lesson Topic: ${lesson.title}\n\n${lesson.contentContext || ''}`
                    : lesson.contentContext;

                setParams((prev: any) => ({
                    ...prev,
                    subject: textbook?.title || prev.subject || '',
                    objectives: effectiveObjectives,
                    grade: textbook?.grade || prev.grade || '',
                    // Reset overrides
                    strategies: [], 
                    model: '5E Model' 
                }));
                toast.success(locale === 'ar' ? 'تم استيراد بيانات الدرس' : 'Lesson data loaded');
            }
        } catch (error) {
            console.error("Failed to load lesson context:", error);
        }
    };

    loadLessonContext();
  }, [lessonIdParam, isLoaded]);

  // Phase 46: Auto-Generation for One-Click Prep
  useEffect(() => {
    if (autoPlan && params.subject && params.grade && !isGenerating && !output) {
      const timer = setTimeout(() => {
        handleGenerate();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [autoPlan, params.subject, params.grade, isGenerating, output]);

  const updateParam = (key: string, value: any) => {
    setParams({ ...params, [key]: value });
  };

  const toggleStrategy = (value: string) => {
    const current = params.strategies || [];
    const updated = current.includes(value) 
        ? current.filter((v: string) => v !== value) 
        : [...current, value];
    updateParam('strategies', updated);
  };

  const getLoadingMessage = (p: number) => {
    if (isRTL) {
        if (p < 30) return 'قراءة سياق الكتاب المدرسي...';
        if (p < 60) return 'تحليل الأهداف حسب تصنيف بلوم...';
        if (p < 90) return 'تصميم الجدول الزمني للحصة...';
        return 'تنسيق الخطة النهائية...';
    }
    if (p < 30) return 'Reading the textbook context...';
    if (p < 60) return "Aligning with Bloom's Taxonomy...";
    if (p < 90) return 'Structuring the timeline...';
    return 'Finalizing your plan...';
  };

  const handleGenerate = async () => {
    if (!params.subject || !params.grade) {
        toast.error(locale === 'ar' ? 'يرجى إكمال البيانات الأساسية' : 'Please complete basic info');
        return;
    }

    setIsGenerating(true);
    setOutput(null); // Clear old plan to show progress
    setProgress(10);
    setStatus(locale === 'ar' ? 'تحميل ذاكرة السياق...' : 'Loading context memory...');

    try {
      // CRITICAL FIX: Fetch fresh textbook data from DB instead of using stale activeBook from context
      // This ensures we get the correct book context even if activeTextbookId was just updated
      const currentTextbook = activeTextbookId 
        ? await db.textbooks.get(activeTextbookId)
        : activeBook;
      
      // PROMPT ENGINE INTEGRATION (Phase 27)
      const { PromptEngine } = await import('@/lib/prompt-engine');
      
      const contentLanguage = currentTextbook?.contentLanguage || locale;
      const prompt = PromptEngine.generatePrompt({
        toolId: 'lesson-planner',
        subject: params.subject,
        grade: params.grade,
        locale: contentLanguage as any,
        bookMemory: currentTextbook?.indexSummary, // CONTEXT MEMORY - Now always fresh!
        context: params.objectives,
        params: {
            objectives: params.objectives,
            strategies: params.strategies,
            duration: params.duration,
            model: params.model,
            differentiation: params.differentiation,
            // Extract Topic if my hack injected it
            topic: params.objectives?.startsWith('Lesson Topic:') ? params.objectives.split('\n')[0].replace('Lesson Topic:', '').trim() : ''
        }
      });

      const formData = new FormData();
      formData.append('profession', 'teacher');
      formData.append('tool', 'lesson-planner');
      // We still pass params but the API route could be updated to prefer the raw system prompt
      // For now we trick the API by sending the engineered prompt as a parameter or we update route.ts
      formData.append('params', JSON.stringify({ ...params, customPrompt: prompt, locale: contentLanguage }));

      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev < 95 ? prev + (95 - prev) * 0.1 : prev;
          setStatus(getLoadingMessage(next));
          return next;
        });
      }, 600);

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);
      setStatus(locale === 'ar' ? 'تم إنشاء الخطة!' : 'Plan created!');

      const data = await res.json();
      setOutput(data);
      setIsGenerating(false);
      toast.success(locale === 'ar' ? 'خطة الدرس جاهزة' : 'Lesson plan ready');
      triggerConfetti(); // Celebrate success!

    } catch (error) {
      setIsGenerating(false);
      toast.error('Failed to generate lesson plan');
    }
  };

  return (
    <>
      <ToolPanel 
        title={locale === 'en' ? 'Smart Lesson Planner' : 'مخطط الدرس الذكي'}
        description={locale === 'en' 
          ? 'Generate integrated lesson plans based on national standards and active learning strategies.' 
          : 'أنشئ خطط دروس متكاملة بناءً على معايير المناهج واستراتيجيات التعلم النشط.'}
        locale={locale}
        icon={<BookOpen className="w-8 h-8" />}
      >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-3xl p-6 shadow-xl space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Subject' : 'المادة'}</Label>
                <Input 
                  value={params.subject} 
                  onChange={(e) => updateParam('subject', e.target.value)}
                  placeholder={locale === 'en' ? 'e.g. Science' : 'مثل العلوم'}
                />
              </div>
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Grade' : 'الصف'}</Label>
                <Input 
                  value={params.grade} 
                  onChange={(e) => updateParam('grade', e.target.value)}
                  placeholder="e.g. 10th"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target size={14} className="text-primary" />
                {locale === 'en' ? 'Learning Objectives' : 'أهداف التعلم'}
              </Label>
              <textarea 
                className="w-full min-h-[100px] rounded-2xl border border-input/50 bg-background/50 p-4 text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all"
                value={params.objectives}
                onChange={(e) => updateParam('objectives', e.target.value)}
                placeholder={locale === 'en' ? 'What should students learn?' : 'ماذا يجب أن يتعلم الطلاب؟'}
              />
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                 <Sparkles size={14} className="text-amber-500" />
                 {locale === 'en' ? 'Instructional Framework' : 'النموذج التربوي'}
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 {['5E Model', 'Gagne 9 Events', 'UDL'].map((m) => (
                    <button
                        key={m}
                        onClick={() => updateParam('model', m)}
                        className={cn(
                            "p-3 rounded-xl text-xs font-bold border transition-all text-left flex flex-col gap-1",
                            params.model === m
                                ? "bg-amber-500 text-white border-amber-500 shadow-md"
                                : "bg-background border-border hover:border-amber-500/50"
                        )}
                    >
                        <span>{m}</span>
                        <span className={cn("text-[9px] font-normal", params.model === m ? "text-white/80" : "text-muted-foreground")}>
                            {m === '5E Model' ? (locale === 'en' ? 'Inquiry-Based' : 'الاستقصاء') : 
                             m === 'Gagne 9 Events' ? (locale === 'en' ? 'Direct Instruction' : 'التعليم المباشر') : 'Inclusion'}
                        </span>
                    </button>
                 ))}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
                  <input 
                    type="checkbox"
                    id="diff-check"
                    checked={params.differentiation}
                    onChange={(e) => updateParam('differentiation', e.target.checked)}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="diff-check" className="text-sm font-medium cursor-pointer flex-grow">
                      {locale === 'en' ? 'Generate Differentiation Strategies' : 'توليد استراتيجيات التمايز (للدعم والإثراء)'}
                  </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Timer size={14} className="text-primary" />
                {locale === 'en' ? 'Duration (min)' : 'المدة (دقيقة)'}
              </Label>
              <div className="flex gap-2">
                 {['45', '90'].map(d => (
                    <button
                        key={d}
                        onClick={() => updateParam('duration', d)}
                        className={cn(
                            "flex-1 py-3 rounded-2xl border transition-all font-bold",
                            params.duration === d ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-muted/30 border-transparent hover:bg-muted"
                        )}
                    >
                        {d}
                    </button>
                 ))}
              </div>
            </div>

            <div className="pt-4">
              {isGenerating ? (
                <ProgressBar progress={progress} status={status} locale={locale} />
              ) : (
                <Button onClick={handleGenerate} className="w-full h-14 rounded-2xl">
                  {locale === 'en' ? 'Generate Plan' : 'إنشاء الخطة'}
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>

          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
           {!output ? (
              <div className="h-full min-h-[500px] border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5 opacity-50">
                 <BookOpen className="w-16 h-16 mb-4 opacity-20" />
                 <p>{locale === 'en' ? 'Your smart lesson plan will appear here' : 'ستظهر خطة الدرس الذكية هنا'}</p>
                 {activeBook?.indexSummary && (
                    <Badge variant="secondary" className="mt-4 bg-primary/5 text-primary border-primary/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {locale === 'ar' ? 'ذاكرة الكتاب نشطة' : 'Textbook memory active'}
                    </Badge>
                 )}
              </div>
           ) : (
              <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in slide-in-from-bottom-4 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                 
                 <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        {locale === 'en' ? 'Intelligent Lesson Plan' : 'خطة الدرس الذكية'}
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl border-primary/20 hover:bg-primary/5"
                        onClick={handleExport}
                    >
                        <Upload className="w-4 h-4 mr-2 rotate-180" />
                        {locale === 'ar' ? 'تصدير PDF' : 'Export PDF'}
                    </Button>
                 </div>
                 
                  <div 
                    id="lesson-plan-output"
                    className={cn(
                    "relative z-10 p-10 bg-white dark:bg-slate-900 border border-white/20 rounded-3xl space-y-6 whitespace-pre-wrap leading-relaxed shadow-sm max-h-[600px] overflow-y-auto custom-scrollbar",
                    locale === 'ar' ? 'font-cairo text-right' : 'font-sans text-left'
                  )}
                  style={{ fontFamily: "'Calibri', 'Arial', sans-serif" }}>
                    {/* PDF Header - Visible only in export mostly, but shown here too */}
                    <div className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-6">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xs">
                                AB
                             </div>
                             <span className="font-bold text-lg tracking-tight text-primary">AI Bridge</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                            {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                    </div>

                    {/* Render data nicely if it's a known structure, or stringify */}
                    {typeof output === 'string' ? output : (
                        <div className="space-y-8">
                            {/* Header Section */}
                            <div className="border-b border-primary/10 pb-4">
                                <h1 className="text-2xl font-black text-primary">{output.title || output.topic}</h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {locale === 'ar' ? 'خطة درس مصممة تربوياً' : 'Pedagogically designed lesson plan'}
                                </p>
                            </div>

                            {/* Objectives & Materials */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {output.objectives && (
                                    <div className="space-y-3">
                                        <h4 className="font-bold flex items-center gap-2 text-primary">
                                            <Sparkles className="w-4 h-4" />
                                            {locale === 'ar' ? 'الأهداف التعليمية' : 'Learning Objectives'}
                                        </h4>
                                        <ul className="space-y-2">
                                            {output.objectives.map((obj: string, i: number) => (
                                                <li key={i} className="flex gap-2 text-sm">
                                                    <span className="text-primary font-bold">•</span>
                                                    {obj}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {output.materialsNeeded && (
                                    <div className="space-y-3">
                                        <h4 className="font-bold flex items-center gap-2 text-primary">
                                            <BookOpen className="w-4 h-4" />
                                            {locale === 'ar' ? 'الوسائل التعليمية' : 'Materials Needed'}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {output.materialsNeeded.map((mat: string, i: number) => {
                                                const lowerMat = mat.toLowerCase();
                                                let affiliate: { id: string, name: string, color: string } | null = null;
                                                
                                                if (lowerMat.includes('slide') || lowerMat.includes('presentation') || lowerMat.includes('عرض')) {
                                                    affiliate = { id: 'gamma', name: isRTL ? 'أنشئ بذكاء' : 'Make with AI', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' };
                                                } else if (lowerMat.includes('quiz') || lowerMat.includes('assessment') || lowerMat.includes('اختبار')) {
                                                    affiliate = { id: 'quizizz', name: isRTL ? 'ابدأ مسابقة' : 'Play Quiz', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' };
                                                } else if (lowerMat.includes('worksheet') || lowerMat.includes('sheet') || lowerMat.includes('ورقة')) {
                                                    affiliate = { id: 'canva', name: isRTL ? 'صمم في كانفا' : 'Design in Canva', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
                                                }

                                                return (
                                                    <div key={i} className="flex items-center gap-1">
                                                        <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50">
                                                            {mat}
                                                        </Badge>
                                                        {affiliate && (
                                                            <a 
                                                                href={AffiliateManager.getLink(affiliate.id)} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className={cn(
                                                                    "text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex items-center gap-1 hover:scale-105 transition-transform",
                                                                    affiliate.color
                                                                )}
                                                            >
                                                                <Sparkles className="w-2 h-2" />
                                                                {affiliate.name}
                                                            </a>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Concept Deep-Dive (Phase 42: Competitive Edge) */}
                            {output.conceptDeepDive && (
                                <div className="p-6 bg-secondary/30 rounded-3xl border border-secondary/20 space-y-6">
                                    <div className="flex items-center gap-2 border-b border-secondary/20 pb-2">
                                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                                        <h3 className="font-black text-lg text-primary">
                                            {locale === 'ar' ? 'التحضير الذكي للمحتوى' : 'Smart Content Preparation'}
                                        </h3>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold uppercase opacity-60 flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                {locale === 'ar' ? 'شرح المادة العلمية' : 'Subject Explanation'}
                                            </span>
                                            <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                                                {output.conceptDeepDive.keyExplanation}
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {output.conceptDeepDive.analogies && (
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold uppercase opacity-60 text-blue-500">
                                                        {locale === 'ar' ? 'تشبيهات للتبسيط' : 'Helpful Analogies'}
                                                    </span>
                                                    <ul className="text-xs space-y-1 italic text-muted-foreground">
                                                        {output.conceptDeepDive.analogies.map((a: string, i: number) => <li key={i}>• {a}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                            {output.conceptDeepDive.commonMisconceptions && (
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold uppercase opacity-60 text-red-500">
                                                        {locale === 'ar' ? 'مفاهيم خاطئة شائعة' : 'Common Misconceptions'}
                                                    </span>
                                                    <ul className="text-xs space-y-1 text-red-600/80">
                                                        {output.conceptDeepDive.commonMisconceptions.map((m: string, i: number) => <li key={i}>⚠️ {m}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Timeline */}
                            {output.timeline && (
                                <div className="space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                                        <Timer className="w-4 h-4" />
                                        {locale === 'ar' ? 'سير الحصة الزمني' : 'Lesson Timeline'}
                                    </h4>
                                    <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-primary/10">
                                        {output.timeline.map((item: any, i: number) => (
                                            <div key={i} className="relative pl-10">
                                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {i + 1}
                                                </div>
                                                <div className="bg-white/30 dark:bg-slate-800/30 p-4 rounded-2xl border border-white/20 shadow-sm">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-black text-sm text-primary">{item.activity || item.title}</span>
                                                        <Badge variant="secondary" className="text-[10px]">{item.time}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                                                    {item.teachingScript && (
                                                        <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/10 italic text-[13px] text-primary/80">
                                                            <span className="font-bold non-italic mr-1 text-[11px] uppercase opacity-70">
                                                                {locale === 'ar' ? 'نص مقترح للمعلم:' : 'Teacher Script:'}
                                                            </span>
                                                            "{item.teachingScript}"
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Assessment Section */}
                            {output.assessment && (
                                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
                                    <h4 className="font-bold flex items-center gap-2 text-primary">
                                        <CheckCircle2 className="w-4 h-4" />
                                        {locale === 'ar' ? 'التقييم والقياس' : 'Assessment & Evaluation'}
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <span className="font-bold text-xs uppercase opacity-50">{locale === 'ar' ? 'التقييم التكويني' : 'Formative'}</span>
                                            <p>{output.assessment.formative}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-bold text-xs uppercase opacity-50">{locale === 'ar' ? 'التقييم الختامي' : 'Summative'}</span>
                                            <p>{output.assessment.summative}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                 </div>
              </div>
           )}
        </div>
      </div>
      </ToolPanel>
      {isGenerating && <MagicLoader locale={locale} context="lesson" />}
    </>
  );
}
