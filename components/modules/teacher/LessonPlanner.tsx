"use client"

import React, { useState, useEffect } from 'react';
import { ToolPanel, ProgressBar } from './shared/ToolPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDrafts } from '@/lib/hooks/use-drafts';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/db';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Minus,
  Timer,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/Badge';

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
  };

  const searchParams = useSearchParams();
  const lessonIdParam = searchParams.get('lessonId');

  const [params, setParams, isLoaded] = useDrafts('teacher-lesson-planner', initialParams);
  
  // Auto-fill from Magic Button
  useEffect(() => {
    if (lessonIdParam && isLoaded) {
        db.lessons.get(parseInt(lessonIdParam)).then(lesson => {
            if (lesson) {
                setParams(prev => ({
                    ...prev,
                    subject: lesson.title, // Simplified mapping
                    objectives: `Lesson Context from ${lesson.date.toLocaleDateString()}:\n${lesson.contentContext}`,
                    grade: '10th' // Helper would fetch from textbook relations in real app
                }));
                toast.success(locale === 'ar' ? 'تم استيراد سياق الدرس' : 'Lesson context imported');
            }
        });
    }
  }, [lessonIdParam, isLoaded]); // Only run once on mount/param change

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

  const handleGenerate = async () => {
    if (!params.subject || !params.grade) {
        toast.error(locale === 'ar' ? 'يرجى إكمال البيانات الأساسية' : 'Please complete basic info');
        return;
    }

    setIsGenerating(true);
    setProgress(10);
    setStatus(locale === 'ar' ? 'تحليل الأهداف التعليمية...' : 'Analyzing learning objectives...');

    try {
      const formData = new FormData();
      formData.append('profession', 'teacher');
      formData.append('tool', 'lesson-planner');
      formData.append('params', JSON.stringify(params));

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 40) return prev + 5;
          if (prev < 80) {
            setStatus(locale === 'ar' ? 'تصميم سير الحصة الزمني...' : 'Designing lesson timeline...');
            return prev + 2;
          }
          return prev;
        });
      }, 400);

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);
      setStatus(locale === 'ar' ? 'تم إنشاء الخطة!' : 'Plan created!');

      const data = await res.json();
      setOutput(data);
      setTimeout(() => setIsGenerating(false), 1000);
      toast.success(locale === 'ar' ? 'خطة الدرس جاهزة' : 'Lesson plan ready');

    } catch (error) {
      setIsGenerating(false);
      toast.error('Failed to generate lesson plan');
    }
  };

  return (
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

            <div className="space-y-3">
              <Label>{locale === 'en' ? 'Strategies' : 'الاستراتيجيات'}</Label>
              <div className="flex flex-wrap gap-2">
                {strategyOptions.map(opt => (
                  <Badge 
                    key={opt.value}
                    variant={params.strategies?.includes(opt.value) ? 'default' : 'outline'}
                    className={cn(
                        "cursor-pointer px-4 py-2 rounded-xl transition-all",
                        params.strategies?.includes(opt.value) ? "bg-primary shadow-lg shadow-primary/20 scale-105" : "hover:bg-muted"
                    )}
                    onClick={() => toggleStrategy(opt.value)}
                  >
                    {locale === 'en' ? opt.labelEn : opt.labelAr}
                  </Badge>
                ))}
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
              </div>
           ) : (
              <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-3xl p-8 shadow-xl space-y-6">
                 <div className="flex items-center gap-2 text-primary font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    {locale === 'en' ? 'Lesson Plan Ready' : 'خطة الدرس جاهزة'}
                 </div>
                 
                 <div className={cn(
                    "p-6 bg-background/50 rounded-2xl space-y-4 whitespace-pre-wrap leading-relaxed",
                    locale === 'ar' ? 'font-cairo text-right' : 'font-sans text-left'
                 )}>
                    {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
                 </div>
              </div>
           )}
        </div>
      </div>
    </ToolPanel>
  );
}
