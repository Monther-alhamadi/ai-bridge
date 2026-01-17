"use client"

import React, { useState } from 'react';
import { ToolPanel, ProgressBar } from './shared/ToolPanel';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDrafts } from '@/lib/hooks/use-drafts';
import { 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  UserRound,
  MessageSquare,
  Zap,
  MousePointer2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface EducationalConsultantProps {
  locale: 'en' | 'ar';
  profession?: string;
  toolSlug?: string;
}

export function EducationalConsultant({ locale, profession, toolSlug }: EducationalConsultantProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [output, setOutput] = useState<any>(null);

  const initialParams = {
    taskType: 'letter',
    tone: 'formal',
    language: locale,
    context: ''
  };

  const [params, setParams, isLoaded] = useDrafts('teacher-consultant', initialParams);

  const updateParam = (key: string, value: any) => {
    setParams({ ...params, [key]: value });
  };

  const taskOptions = [
    { value: 'letter', icon: MessageSquare, labelEn: 'Parent Letter', labelAr: 'رسالة لأولياء الأمور' },
    { value: 'behavior', icon: UserRound, labelEn: 'Behavior Issue', labelAr: 'حل لمشكلة سلوكية' },
    { value: 'project', icon: Lightbulb, labelEn: 'Project Idea', labelAr: 'فكرة مشروع تعليمي' },
  ];

  const toneOptions = [
    { value: 'formal', labelEn: 'Formal', labelAr: 'رسمي' },
    { value: 'friendly', labelEn: 'Friendly', labelAr: 'ودي' },
    { value: 'firm', labelEn: 'Firm', labelAr: 'حازم' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(20);
    setStatus(locale === 'ar' ? 'تحليل الحالة التربوية...' : 'Analyzing educational case...');

    try {
      const formData = new FormData();
      formData.append('profession', 'teacher');
      formData.append('tool', 'educational-consultant');
      formData.append('params', JSON.stringify(params));

      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
        setStatus(locale === 'ar' ? 'صياغة الحل المقترح...' : 'Crafting suggested solution...');
      }, 600);

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);
      setStatus(locale === 'ar' ? 'تم تجهيز الاستشارة!' : 'Consultation ready!');

      const data = await res.json();
      setOutput(data);
      setTimeout(() => setIsGenerating(false), 1000);
      toast.success(locale === 'ar' ? 'الاستشارة جاهزة' : 'Consultation ready');

    } catch (error) {
      setIsGenerating(false);
      toast.error('Failed to generate consultation');
    }
  };

  const copyToClipboard = () => {
    const text = typeof output === 'string' ? output : JSON.stringify(output);
    navigator.clipboard.writeText(text);
    toast.success(locale === 'ar' ? 'تم النسخ!' : 'Copied!');
  };

  return (
    <ToolPanel 
      title={locale === 'en' ? 'AI Educational Consultant' : 'المستشار التربوي الذكي'}
      description={locale === 'en' 
        ? 'Professional solutions for classroom management, parent communication, and creative projects.' 
        : 'حلول احترافية لإدارة الصف، التواصل مع أولياء الأمور، والمشاريع التعليمية المبتكرة.'}
      locale={locale}
      icon={<UserRound className="w-8 h-8" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-3xl p-6 shadow-xl space-y-6">
            
            <div className="space-y-3">
              <Label>{locale === 'en' ? 'What do you need?' : 'بماذا تحتاج مساعدة؟'}</Label>
              <div className="grid grid-cols-1 gap-2">
                {taskOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateParam('taskType', opt.value)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
                      params.taskType === opt.value 
                        ? "bg-primary/10 border-primary text-primary shadow-sm" 
                        : "bg-muted/20 border-transparent hover:bg-muted/40"
                    )}
                  >
                    <opt.icon size={18} />
                    <span className="text-sm font-medium">{locale === 'en' ? opt.labelEn : opt.labelAr}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>{locale === 'en' ? 'Tone Select' : 'اختيار النبرة'}</Label>
              <div className="flex gap-2">
                 {toneOptions.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => updateParam('tone', opt.value)}
                        className={cn(
                            "flex-1 py-3 rounded-2xl border text-xs font-bold transition-all",
                            params.tone === opt.value 
                              ? "bg-primary text-primary-foreground border-primary shadow-md" 
                              : "bg-muted/30 border-transparent hover:bg-muted"
                        )}
                    >
                        {locale === 'en' ? opt.labelEn : opt.labelAr}
                    </button>
                 ))}
              </div>
            </div>

            <div className="space-y-2">
               <Label>{locale === 'en' ? 'Additional Context (Optional)' : 'سياق إضافي (اختياري)'}</Label>
               <textarea 
                  className="w-full min-h-[120px] rounded-2xl border border-input/50 bg-background/50 p-4 text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all"
                  value={params.context}
                  onChange={(e) => updateParam('context', e.target.value)}
                  placeholder={locale === 'en' ? 'Describe the situation...' : 'صف الموقف أو المشكلة...'}
               />
            </div>

            <div className="pt-2">
              {isGenerating ? (
                <ProgressBar progress={progress} status={status} locale={locale} />
              ) : (
                <Button onClick={handleGenerate} className="w-full h-14 rounded-2xl">
                  {locale === 'en' ? 'Get Advice' : 'احصل على الاستشارة'}
                  <Zap className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>

          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-8">
           {!output ? (
              <div className="h-full min-h-[500px] border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5 opacity-50">
                 <Zap className="w-16 h-16 mb-4 opacity-10 animate-pulse" />
                 <p>{locale === 'en' ? 'Expert consultant advice will appear here' : 'ستظهر استشارة الخبير هنا'}</p>
              </div>
           ) : (
              <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-3xl p-8 shadow-xl space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-bold">
                       <CheckCircle2 className="w-5 h-5" />
                       {locale === 'en' ? 'Consultation Result' : 'نتيجة الاستشارة'}
                    </div>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-xs">
                       <MousePointer2 className="w-4 h-4 mr-2" />
                       {locale === 'en' ? 'Copy Text' : 'نسخ النص'}
                    </Button>
                 </div>
                 
                 <div className={cn(
                    "p-8 bg-background/50 rounded-3xl space-y-4 whitespace-pre-wrap leading-relaxed shadow-inner",
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
