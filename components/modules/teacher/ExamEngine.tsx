"use client"

import React, { useState, useRef, useEffect } from 'react';
import { ToolPanel, ProgressBar } from './shared/ToolPanel';
import { PrintHeader } from './shared/PrintHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useDrafts } from '@/lib/hooks/use-drafts';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Plus, 
  Minus, 
  ChevronRight, 
  CheckCircle2, 
  Download,
  School,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/db';

// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ExamEngineProps {
  locale: 'en' | 'ar';
  profession?: string;
  toolSlug?: string;
}

export function ExamEngine({ locale, profession, toolSlug }: ExamEngineProps) {
  const isRTL = locale === 'ar';
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  
  // States for printing
  const [schoolName, setSchoolName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [logo, setLogo] = useState<string | null>(null);

  // Draft integration
  const toolId = 'teacher-exam-engine';
  const initialParams = {
    pageRange: '',
    mcqCount: 10,
    trueFalseCount: 5,
    essayCount: 2,
    fillBlanksCount: 0,
    matchingCount: 0,
    difficulty: 3,
    language: locale,
    schoolName: '',
    teacherName: '',
  };



  const searchParams = useSearchParams();
  const lessonIdParam = searchParams.get('lessonId');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [params, setParams, isLoaded] = useDrafts(toolId, initialParams);
  
  // Local file state (not in drafts as it's a binary)
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [output, setOutput] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (isLoaded) {
        setSchoolName(params.schoolName || '');
        setTeacherName(params.teacherName || '');

        if (lessonIdParam) {
            db.lessons.get(parseInt(lessonIdParam)).then(lesson => {
                if (lesson) {
                    setParams(prev => ({
                        ...prev,
                        schoolName: params.schoolName, // preserve
                        teacherName: params.teacherName, // preserve
                        // We hijack the 'pageRange' or just assume prompt factory handles 'context'
                        // Since ExamEngine mainly uses file or pageRange, for now we will 
                        // simulate a "Virtual File" by passing context text in a hidden way or specialized param.
                        // Actually, let's just use a new phantom state for context if file is missing.
                    }));
                    
                    // We need to modify ExamEngine to accept raw text context if file is missing.
                    // For now, let's put it in a hidden "Simulated Content" message.
                    toast.success(locale === 'ar' 
                        ? `تم تحميل محتوى الدرس: ${lesson.title}` 
                        : `Lesson content loaded: ${lesson.title}`);
                    
                    // In a real implementation effectively we'd need a 'context' field in generation params
                    // Let's add it to params draft temporarily
                    setParams(prev => ({ ...prev, context: lesson.contentContext }));
                }
            });
        }
     }
  }, [isLoaded, lessonIdParam]);

  const updateParam = (key: string, value: any) => {
    setParams({ ...params, [key]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  };

  const handleGenerate = async () => {
    // Check if we have file, page range, OR context (from Magic Button)
    if (!file && !params.pageRange && !params.context) {
        toast.error(locale === 'ar' ? 'يرجى رفع ملف أو تحديد نطاق صفحات' : 'Please upload a file or specify page range');
        return;
    }

    setIsGenerating(true);
    setProgress(10);
    setStatus(locale === 'ar' ? 'قراءة الملف وتحليل المحتوى...' : 'Reading file and analyzing content...');

    try {
      const formData = new FormData();
      formData.append('profession', 'teacher');
      formData.append('tool', 'exam-generator');
      
      const payload = {
        ...params,
        schoolName,
        teacherName,
        logoAttached: !!logo
      };
      
      formData.append('params', JSON.stringify(payload));
      if (file) formData.append('file', file);

      // Simulate progress while waiting
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 40) return prev + 2;
          if (prev < 70) {
            setStatus(locale === 'ar' ? 'صياغة الأسئلة التربوية...' : 'Formulating educational questions...');
            return prev + 1;
          }
          if (prev < 95) {
            setStatus(locale === 'ar' ? 'تنسيق هيكل الاختبار...' : 'Formatting exam structure...');
            return prev + 0.5;
          }
          return prev;
        });
      }, 500);

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);
      setStatus(locale === 'ar' ? 'تم التوليد بنجاح!' : 'Generation successful!');

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setOutput(data);
      setTimeout(() => setIsGenerating(false), 1000);
      toast.success(locale === 'ar' ? 'جاهز للمعاينة والطباعة' : 'Ready for preview and printing');

    } catch (error: any) {
      setIsGenerating(false);
      toast.error(error.message || 'Generation failed');
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    
    const element = printRef.current;
    const opt = {
      margin: 10,
      filename: `Exam_${schoolName || 'Document'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <ToolPanel 
      title={locale === 'en' ? 'Professional Exam Engine' : 'محرك الاختبارات الاحترافي'}
      description={locale === 'en' 
        ? 'Convert books and documents into high‑quality academic exams with localized school headers.' 
        : 'حوّل الكتب والوثائق إلى اختبارات مدرسية احترافية مع ترويسة مخصصة لمدرستك.'}
      locale={locale}
      icon={<FileText className="w-8 h-8" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel (4/12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-3xl p-6 shadow-xl space-y-6">
            
            {/* File Upload Section */}
            <div className="relative group">
              <Label>{locale === 'en' ? 'Source Content' : 'محتوى المصدر'}</Label>
              <div className={cn(
                "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300",
                file ? "border-primary/50 bg-primary/5" : "border-border/60 hover:border-primary/30"
              )}>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="p-4 rounded-full bg-primary/10 mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">
                  {fileName || (locale === 'en' ? 'Drop PDF or Click to Upload' : 'اسحب ملف PDF أو اضغط للرفع')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Max 15,000 characters from file</p>
              </div>
            </div>

            {/* Customization Section */}
            <PrintHeader 
              schoolName={schoolName}
              setSchoolName={(val) => { setSchoolName(val); updateParam('schoolName', val); }}
              teacherName={teacherName}
              setTeacherName={(val) => { setTeacherName(val); updateParam('teacherName', val); }}
              logo={logo}
              setLogo={setLogo}
              locale={locale}
            />

            {/* Config Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Page Range' : 'نطاق الصفحات'}</Label>
                <Input 
                  value={params.pageRange} 
                  onChange={(e) => updateParam('pageRange', e.target.value)}
                  placeholder="e.g. 5-15"
                />
              </div>
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Difficulty' : 'الصعوبة'}</Label>
                <div className="pt-2">
                  <Slider 
                    value={[params.difficulty]} 
                    min={1} max={5} step={1}
                    onValueChange={(v) => updateParam('difficulty', v[0])}
                  />
                  <div className="flex justify-between mt-1 text-[10px] text-muted-foreground font-bold">
                    <span>EASY</span>
                    <span>BLOOM {params.difficulty}</span>
                    <span>HARD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Counters */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: locale === 'ar' ? 'اختيار من متعدد' : 'MCQ', key: 'mcqCount' as const },
                { label: locale === 'ar' ? 'صح/خطأ' : 'True/False', key: 'trueFalseCount' as const },
                { label: locale === 'ar' ? 'مقال' : 'Essay', key: 'essayCount' as const },
                { label: locale === 'ar' ? 'إكمال فراغ' : 'Fill Blanks', key: 'fillBlanksCount' as const },
                { label: locale === 'ar' ? 'توصيل' : 'Matching', key: 'matchingCount' as const }
              ].map((item) => (
                <div key={item.key} className="bg-muted/30 rounded-2xl p-3 flex flex-col items-center border border-transparent hover:border-primary/20 transition-colors">
                  <span className="text-[10px] font-bold text-muted-foreground mb-1 text-center leading-tight h-8 flex items-center">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateParam(item.key, Math.max(0, (params[item.key] as number) - 1))} className="hover:text-primary transition-colors p-1"><Minus size={14} /></button>
                    <span className="text-sm font-bold tabular-nums w-4 text-center">{params[item.key]}</span>
                    <button onClick={() => updateParam(item.key, (params[item.key] as number) + 1)} className="hover:text-primary transition-colors p-1"><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Status & Action */}
            <div className="pt-4 border-t border-border/40">
              {isGenerating && <ProgressBar progress={progress} status={status} locale={locale} />}
              {!isGenerating && (
                <Button 
                  onClick={handleGenerate} 
                  className="w-full h-14 rounded-2xl relative overflow-hidden group"
                  disabled={isGenerating}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    {locale === 'en' ? 'Start Generation' : 'بدء التوليد الذكي'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Output Preview (8/12) */}
        <div className="lg:col-span-7">
           {!output ? (
              <div className="h-full min-h-[500px] border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5 opacity-50">
                 <School className="w-16 h-16 mb-4 opacity-20" />
                 <p className="text-lg">{locale === 'en' ? 'Generated Exam Preview' : 'معاينة الاختبار المولد'}</p>
                 <p className="text-sm">{locale === 'en' ? 'Ready to output your professional document' : 'جاهز لإخراج مستندك الاحترافي'}</p>
              </div>
           ) : (
              <div className="space-y-4">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold flex items-center gap-2">
                       <CheckCircle2 className="text-green-500 w-5 h-5" />
                       {locale === 'en' ? 'Generated Masterpiece' : 'التحفة المولدة'}
                    </h3>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={handlePrint}>
                          <Printer className="w-4 h-4 mr-2" />
                          {locale === 'en' ? 'Print PDF' : 'طباعة'}
                       </Button>
                    </div>
                 </div>

                 {/* Printable Area */}
                 <div 
                    ref={printRef}
                    className={cn(
                      "bg-white text-black p-10 shadow-2xl rounded-sm min-h-[297mm] font-serif",
                      locale === 'ar' ? 'font-cairo text-right' : 'font-serif text-left'
                    )}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                 >
                    {/* Professional Header */}
                    <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-8">
                       {logo && <img src={logo} alt="School Logo" className="w-16 h-16 object-contain" />}
                       <div className="text-center flex-1">
                          <h1 className="text-xl font-bold uppercase">{schoolName || (locale === 'ar' ? 'اسم المدرسة' : 'School Name')}</h1>
                          <p className="text-sm">{locale === 'ar' ? 'اختبار مخصص' : 'Custom Assessment'}</p>
                       </div>
                       <div className="text-sm text-right">
                          <p>{locale === 'ar' ? 'اسم المعلم:' : 'Teacher:'} {teacherName || '...'}</p>
                          <p>{locale === 'ar' ? 'التاريخ:' : 'Date:'} {new Date().toLocaleDateString(locale)}</p>
                       </div>
                    </div>

                    {/* Content from AI JSON */}
                    <div className="space-y-6">
                       <div className="text-center bg-gray-100 p-2 rounded">
                          <h2 className="font-bold">{output.title || (locale === 'ar' ? 'عنوان الاختبار' : 'Exam Title')}</h2>
                       </div>
                       
                       {/* Render Questions */}
                       {output.questions?.map((q: any, i: number) => (
                          <div key={i} className="space-y-2 break-inside-avoid">
                             <p className="font-bold">Q{i+1}: {q.text}</p>
                             {q.options && (
                                <div className="grid grid-cols-2 gap-2 pl-4">
                                   {q.options.map((opt: string, oi: number) => (
                                      <p key={oi}>{String.fromCharCode(97 + oi)}) {opt}</p>
                                   ))}
                                </div>
                             )}
                             {q.type === 'essay' && (
                                <div className="h-24 border-b border-gray-300 w-full" />
                             )}
                          </div>
                       ))}
                    </div>

                    {/* Footer / Score Area */}
                    <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between text-xs text-gray-500 italic">
                       <span>AI Bridge • Professional Teacher OS</span>
                       <span>Score: ____ / ____</span>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
    </ToolPanel>
  );
}
