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
  Upload,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/db';
import { useCurriculum } from '@/lib/hooks/use-curriculum-context';
import { Badge } from '@/components/Badge';
import { useLiveQuery } from 'dexie-react-hooks';

// SSR Safe: Move html2pdf import to handlePrint

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
  const { activeTextbookId } = useCurriculum();
  const [selectedTextbookId, setSelectedTextbookId] = useState<number | null>(null);

  // Sync selected textbook with active one initially
  useEffect(() => {
    if (activeTextbookId && selectedTextbookId === null) {
      setSelectedTextbookId(activeTextbookId);
    }
  }, [activeTextbookId]);

  const allTextbooks = useLiveQuery(() => db.textbooks.toArray());
  const allLessons = useLiveQuery(() => 
    db.lessons.where('textbookId').equals(selectedTextbookId || activeTextbookId || -1).toArray()
  , [activeTextbookId, selectedTextbookId]);
  
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
    context: '',
  };



  const searchParams = useSearchParams();
  const lessonIdParam = searchParams.get('lessonId');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [params, setParams, isLoaded] = useDrafts(toolId, initialParams);
  
  // Local file state (not in drafts as it's a binary)
  const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [output, setOutput] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Reset selected lessons when switching textbooks
  useEffect(() => {
    setSelectedLessonIds([]);
  }, [selectedTextbookId]);

  useEffect(() => {
     if (isLoaded) {
        setSchoolName(params.schoolName || '');
        setTeacherName(params.teacherName || '');

        if (lessonIdParam) {
            const id = parseInt(lessonIdParam);
            if (!isNaN(id)) {
                setSelectedLessonIds(prev => prev.includes(id) ? prev : [...prev, id]);
            }
        }
     }
  }, [isLoaded, lessonIdParam]);

  // Gather context from selected lessons
  useEffect(() => {
    if (selectedLessonIds.length > 0) {
        db.lessons.filter(l => selectedLessonIds.includes(l.id!)).toArray().then(selectedLessons => {
            const combinedContext = selectedLessons.map(l => `[${l.title}]: ${l.contentContext}`).join('\n\n');
            setParams(prev => ({ ...prev, context: combinedContext }));
            
            if (selectedLessons.length === 1) {
                toast.success(locale === 'ar' 
                    ? `تم تحميل محتوى الدرس: ${selectedLessons[0].title}` 
                    : `Lesson content loaded: ${selectedLessons[0].title}`);
            }
        });
    }
  }, [selectedLessonIds]);

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
    setStatus(locale === 'ar' ? 'تحميل ذاكرة السياق...' : 'Loading context memory...');

    try {
      const activeBook = (await db.textbooks.toArray()).find(t => t.id === (selectedTextbookId || activeTextbookId));

      const formData = new FormData();
      formData.append('profession', 'teacher');
      formData.append('tool', 'exam-generator');
      
      const payload = {
        ...params,
        schoolName,
        teacherName,
        logoAttached: !!logo,
        difficulty: params.difficulty,
        mcqCount: params.mcqCount,
        trueFalseCount: params.trueFalseCount,
        essayCount: params.essayCount,
        fillBlanksCount: params.fillBlanksCount,
        matchingCount: params.matchingCount,
        subject: activeBook?.subject || params.pageRange || (file ? file.name : 'General'),
        grade: activeBook?.grade || 'General'
      };
      
      formData.append('params', JSON.stringify(payload));
      if (file) formData.append('file', file);

      // Simulate progress while waiting
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 40) return prev + 2;
          if (prev < 70) {
            setStatus(locale === 'ar' ? 'صياغة الأسئلة التربوية (Bloom Taxonomy)...' : 'Formulating Bloom Taxonomy questions...');
            return prev + 1;
          }
          if (prev < 90) {
            setStatus(locale === 'ar' ? 'تجهيز نموذج الإجابة...' : 'Preparing marking scheme...');
            return prev + 1;
          }
          if (prev < 95) {
            setStatus(locale === 'ar' ? 'تنسيق الهيكل الاحترافي...' : 'Formatting professional structure...');
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
      
      // The AI now returns { result: { examTitle, questions, markingScheme, taxonomyMatrix } }
      setOutput(data.result || data);
      setTimeout(() => setIsGenerating(false), 1000);
      toast.success(locale === 'ar' ? 'جاهز للمعاينة والطباعة' : 'Ready for preview and printing');

    } catch (error: any) {
      setIsGenerating(false);
      toast.error(error.message || 'Generation failed');
    }
  };

   const updateQuestion = (globalIndex: number, field: string, value: any) => {
    if (!output) return;
    
    if (output.sections) {
      const newSections = [...output.sections];
      let currentOffset = 0;
      for (const section of newSections) {
        if (globalIndex < currentOffset + (section.questions?.length || 0)) {
          const localIndex = globalIndex - currentOffset;
          section.questions[localIndex] = { ...section.questions[localIndex], [field]: value };
          setOutput({ ...output, sections: newSections });
          return;
        }
        currentOffset += (section.questions?.length || 0);
      }
    } else if (output.questions) {
      const newQuestions = [...output.questions];
      newQuestions[globalIndex] = { ...newQuestions[globalIndex], [field]: value };
      setOutput({ ...output, questions: newQuestions });
    }
  };

  const handlePrint = async () => {
    if (!printRef.current) return;
    
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default;
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

  const handleExportWord = async () => {
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = await import('docx');
      const saveAs = (await import('file-saver')).default;

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new Paragraph({
              text: schoolName || (locale === 'ar' ? 'اسم المدرسة' : 'School Name'),
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: output.examTitle || (locale === 'ar' ? 'اختبار أكاديمي' : 'Academic Exam'),
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              spacing: { before: 400, after: 400 },
            }),
            new Paragraph({
               children: [
                 new TextRun({ text: `Teacher: ${teacherName || '...'}`, bold: true }),
                 new TextRun({ text: `\tDate: ${new Date().toLocaleDateString(locale)}`, bold: true }),
               ],
               alignment: AlignmentType.BOTH,
               spacing: { after: 800 },
            }),

            ...((output.sections || [{ questions: output.questions }]).flatMap((section: any, sIdx: number) => [
               new Paragraph({
                 text: section.sectionTitle || '',
                 heading: HeadingLevel.HEADING_3,
                 spacing: { before: 400, after: 200 },
               }),
               ...(section.instructions ? [new Paragraph({ 
                 children: [new TextRun({ text: `* ${section.instructions}`, italics: true })],
                 spacing: { after: 200 } 
               })] : []),
               ...(section.questions?.flatMap((q: any, qIdx: number) => {
                 const questionsBefore = (output.sections?.slice(0, sIdx).reduce((acc: number, s: any) => acc + (s.questions?.length || 0), 0) || 0);
                 const globalIdx = questionsBefore + qIdx;
                 
                 return [
                   new Paragraph({
                     children: [
                       new TextRun({ text: `${globalIdx + 1}. `, bold: true }),
                       new TextRun({ text: q.text }),
                       new TextRun({ text: ` [${q.points || 1} M]`, bold: true, italics: true }),
                     ],
                     spacing: { before: 200, after: 100 },
                   }),
                   ...(q.options ? q.options.map((opt: string, oIdx: number) => 
                     new Paragraph({
                       text: `   ${String.fromCharCode(65 + oIdx)}) ${opt}`,
                       spacing: { after: 50 },
                     })
                   ) : []),
                   ...(q.matchingPairs ? q.matchingPairs.map((pair: any, pIdx: number) => 
                     new Paragraph({
                       children: [
                         new TextRun({ text: `   ${pIdx + 1}. ${pair.sideA}`, bold: true }),
                         new TextRun({ text: ` \t [ ] \t ${pair.sideB}` }),
                       ],
                       spacing: { after: 50 },
                     })
                   ) : []),
                   ...(q.type?.toLowerCase().includes('essay') || q.type?.toLowerCase().includes('blank') ? [
                     new Paragraph({ text: "\n", border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } } }),
                     new Paragraph({ text: "\n", spacing: { after: 400 } })
                   ] : []),
                 ];
               }) || [])
            ])),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Exam_${schoolName || 'Document'}.docx`);
      toast.success(locale === 'ar' ? 'تم تصدير ملف Word' : 'Word file exported');
    } catch (err) {
      console.error(err);
      toast.error(locale === 'ar' ? 'فشل تصدير Word' : 'Word export failed');
    }
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
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2rem] p-8 shadow-2xl shadow-indigo-500/5 space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 pointer-events-none" />
            
            {/* Textbook Selector (Book Switching) */}
            <div className="space-y-4 relative z-10">
              <Label className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  {locale === 'en' ? 'Select Subject / Book' : 'اختر المادة / الكتاب'}
                </span>
                {allTextbooks && (
                  <Badge variant="secondary" className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-none px-2 py-0.5 shadow-sm">
                    {allTextbooks.length} {locale === 'ar' ? 'كتب' : 'Books'}
                  </Badge>
                )}
              </Label>
              <div className="grid grid-cols-1 gap-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                {allTextbooks?.map(book => (
                  <button
                    key={book.id}
                    onClick={() => setSelectedTextbookId(book.id!)}
                    className={cn(
                      "group flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 text-right shrink-0 relative overflow-hidden",
                      (selectedTextbookId || activeTextbookId) === book.id
                        ? "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white"
                        : "bg-white/50 dark:bg-slate-800/50 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:scale-[1.02]"
                    )}
                  >
                    <div className={cn(
                      "p-2.5 rounded-xl shrink-0 transition-colors duration-300",
                      (selectedTextbookId || activeTextbookId) === book.id 
                        ? "bg-white/20 text-white" 
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600"
                    )}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
                      <p className={cn(
                        "text-sm font-bold truncate transition-colors",
                        (selectedTextbookId || activeTextbookId) === book.id ? "text-white" : "text-slate-700 dark:text-slate-200"
                      )}>{book.title}</p>
                      <p className={cn(
                        "text-[10px] font-bold opacity-70 truncate uppercase tracking-wider",
                        (selectedTextbookId || activeTextbookId) === book.id ? "text-indigo-100" : "text-slate-400"
                      )}>{book.grade} • {book.subject}</p>
                    </div>
                    {(selectedTextbookId || activeTextbookId) === book.id && (
                      <CheckCircle2 className="w-5 h-5 text-white shrink-0 animate-in zoom-in spin-in-45 duration-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Lesson Selector (Deep Linking) */}
            {(selectedTextbookId || activeTextbookId) && allLessons && allLessons.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 relative z-10">
                <Label className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    {locale === 'en' ? 'Select Lessons Content' : 'اختر دروس الاختبار'}
                  </span>
                  <Badge variant="outline" className="text-[10px] border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50 dark:bg-indigo-500/10">
                    {selectedLessonIds.length} {locale === 'ar' ? 'دروس' : 'Selected'}
                  </Badge>
                </Label>
                <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-1 scrollbar-hide">
                  {allLessons.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLessonIds(prev => 
                        prev.includes(l.id!) ? prev.filter(id => id !== l.id) : [...prev, l.id!]
                      )}
                      className={cn(
                        "text-[11px] px-3 py-2 rounded-xl border transition-all duration-300 font-bold flex items-center gap-1.5",
                        selectedLessonIds.includes(l.id!)
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-105"
                          : "bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                      )}
                    >
                      {selectedLessonIds.includes(l.id!) && <Sparkles className="w-3 h-3 animate-pulse" />}
                      <span className="truncate max-w-[150px]">{l.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            {/* Premium Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                { 
                  label: isRTL ? 'اختيارات' : 'MCQ', 
                  key: 'mcqCount' as const, 
                  icon: <span className="text-[10px] font-black tracking-tighter">ABC</span>,
                  bg: "from-blue-500/10 to-blue-600/10",
                  border: "hover:border-blue-200 dark:hover:border-blue-500/30",
                  text: "text-blue-600 dark:text-blue-400",
                  ring: "focus-within:ring-blue-500/20"
                },
                { 
                  label: isRTL ? 'صح/خطأ' : 'T/F', 
                  key: 'trueFalseCount' as const, 
                  icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                  bg: "from-emerald-500/10 to-emerald-600/10",
                  border: "hover:border-emerald-200 dark:hover:border-emerald-500/30",
                  text: "text-emerald-600 dark:text-emerald-400",
                  ring: "focus-within:ring-emerald-500/20"
                },
                { 
                  label: isRTL ? 'مقالي' : 'Essay', 
                  key: 'essayCount' as const, 
                  icon: <FileText className="w-3.5 h-3.5" />,
                  bg: "from-amber-500/10 to-orange-600/10",
                  border: "hover:border-amber-200 dark:hover:border-amber-500/30",
                  text: "text-amber-600 dark:text-amber-400",
                  ring: "focus-within:ring-amber-500/20"
                },
                { 
                  label: isRTL ? 'فراغات' : 'Blanks', 
                  key: 'fillBlanksCount' as const, 
                  icon: <Minus className="w-3.5 h-3.5" />,
                  bg: "from-purple-500/10 to-violet-600/10",
                  border: "hover:border-purple-200 dark:hover:border-purple-500/30",
                  text: "text-purple-600 dark:text-purple-400",
                  ring: "focus-within:ring-purple-500/20"
                },
                { 
                  label: isRTL ? 'توصيل' : 'Connect', 
                  key: 'matchingCount' as const, 
                  icon: <Plus className="w-3.5 h-3.5 rotate-45" />,
                  bg: "from-pink-500/10 to-rose-600/10",
                  border: "hover:border-pink-200 dark:hover:border-pink-500/30",
                  text: "text-pink-600 dark:text-pink-400",
                  ring: "focus-within:ring-pink-500/20"
                }
              ].map((item) => (
                <div 
                  key={item.key} 
                  className={cn(
                    "relative overflow-hidden group rounded-2xl p-3 flex flex-col items-center border border-transparent transition-all duration-300",
                    "bg-gradient-to-br hover:shadow-lg hover:-translate-y-0.5",
                    item.bg,
                    item.border
                  )}
                >
                  <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-10 transition-opacity duration-500 scale-150 transform origin-top-right">
                    {item.label === 'MCQ' || item.label === 'اختيارات' ? <Sparkles size={40} /> : <FileText size={40} />}
                  </div>
                  
                  <div className={cn("mb-2 p-2 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur-sm shadow-sm", item.text)}>
                    {item.icon}
                  </div>
                  
                  <span className={cn("text-[10px] font-black uppercase tracking-tight mb-2 text-center leading-tight transition-colors", item.text)}>
                    {item.label}
                  </span>
                  
                  <div className="flex items-center gap-1.5 bg-white/50 dark:bg-black/10 rounded-full px-1.5 py-0.5 ring-1 ring-black/5 dark:ring-white/10 w-full justify-between">
                    <button 
                      onClick={() => updateParam(item.key, Math.max(0, (params[item.key] as number) - 1))} 
                      className={cn("hover:scale-110 active:scale-90 transition-transform p-1 rounded-full", item.text)}
                    >
                      <Minus size={10} strokeWidth={4} />
                    </button>
                    <span className="text-sm font-black tabular-nums min-w-[1.2rem] text-center text-slate-700 dark:text-slate-200">{params[item.key]}</span>
                    <button 
                      onClick={() => updateParam(item.key, (params[item.key] as number) + 1)} 
                      className={cn("hover:scale-110 active:scale-90 transition-transform p-1 rounded-full", item.text)}
                    >
                      <Plus size={10} strokeWidth={4} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Status & Action */}
            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
              {isGenerating && <ProgressBar progress={progress} status={status} locale={locale} />}
              {!isGenerating && (
                <Button 
                  onClick={handleGenerate} 
                  className="w-full h-16 rounded-2xl relative overflow-hidden group shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-500"
                  disabled={isGenerating}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient" />
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg font-black tracking-wide text-white">
                    <span className="p-2 rounded-lg bg-white/20 backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </span>
                    {locale === 'en' ? 'GENERATE EXAM' : 'توليد الاختبار الآن'}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Output Preview (7/12) */}
        <div className="lg:col-span-7 h-[calc(100vh-200px)] flex flex-col">
           {!output ? (
              <div className="flex-1 border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5 opacity-50">
                 <School className="w-16 h-16 mb-4 opacity-20" />
                 <p className="text-lg font-bold">{locale === 'en' ? 'Generated Exam Preview' : 'معاينة الاختبار المولد'}</p>
                 <p className="text-sm">{locale === 'en' ? 'Ready to output your professional document' : 'جاهز لإخراج مستندك الاحترافي'}</p>
                 <div className="flex gap-2 mt-4">
                    {activeTextbookId && (
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {locale === 'ar' ? 'ذاكرة الكتاب نشطة' : 'Textbook memory active'}
                        </Badge>
                    )}
                    {selectedLessonIds.length > 0 && (
                        <Badge variant="outline" className="border-blue-400/30 text-blue-600">
                            {selectedLessonIds.length} {locale === 'ar' ? 'دروس مختارة' : 'Lessons selected'}
                        </Badge>
                    )}
                 </div>
              </div>
           ) : (
              <div className="flex-1 flex flex-col space-y-4">
                 <div className="flex items-center justify-between mb-2 shrink-0">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="text-green-500 w-5 h-5" />
                        <h3 className="font-black text-lg">{locale === 'en' ? 'Final Draft' : 'المسودة النهائية'}</h3>
                    </div>
                     <div className="flex gap-2 print:hidden">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handlePrint} 
                          className="h-9 rounded-xl border-primary/20 hover:bg-primary/5 text-xs font-black"
                        >
                           <Printer className="w-4 h-4 mr-2" />
                           {locale === 'en' ? 'PDF' : 'تصدير PDF'}
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleExportWord} 
                          className="h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/20"
                        >
                           <FileText className="w-4 h-4 mr-2" />
                           {locale === 'en' ? 'DOCX' : 'تصدير وورد'}
                        </Button>
                        <Button size="sm" onClick={() => setOutput(null)} variant="ghost" className="h-9 rounded-xl text-xs font-black">
                           {locale === 'en' ? 'New' : 'جديد'}
                        </Button>
                     </div>
                 </div>

                 {/* Professional Scrollable Preview Area */}
                 <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* Bloom taxonomy Matrix Visualization */}
                    {output.taxonomyMatrix && (
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-4 animate-in fade-in slide-in-from-top-2">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                {locale === 'ar' ? 'تحليل مصفوفة مستويات بلوم' : 'Bloom Taxonomy Analysis'}
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(output.taxonomyMatrix).map(([level, val]: [string, any]) => (
                                    <div key={level} className="bg-white/50 rounded-lg p-2 border border-primary/5">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{level}</p>
                                        <p className="text-sm font-black text-primary">{typeof val === 'number' ? `${val}%` : val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                     {/* The Printable Page */}
                    <div 
                        ref={printRef}
                        className={cn(
                          "bg-white text-black p-16 shadow-2xl rounded-sm min-h-[297mm] font-serif border border-slate-300 ring-2 ring-slate-100 relative",
                          "before:absolute before:inset-0 before:border-[1px] before:border-black/5 before:m-4 before:pointer-events-none",
                          locale === 'ar' ? 'font-cairo text-right rtl' : 'font-serif text-left ltr'
                        )}
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    >
                         {/* Professional Academic Header */}
                        <div className="flex justify-between items-start border-b-4 border-double border-black pb-6 mb-10">
                           <div className="text-right flex-1" dir="rtl">
                              <h1 className="text-2xl font-black tracking-tight mb-1">{schoolName || (locale === 'ar' ? 'اسم المؤسسة التعليمية' : 'Educational Institution')}</h1>
                              <div className="h-1 w-20 bg-black mt-1" />
                           </div>
                           
                           {logo ? (
                               <img src={logo} alt="Logo" className="w-20 h-20 object-contain mx-6" />
                           ) : (
                               <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center mx-6 opacity-10">
                                   <School className="w-10 h-10" />
                               </div>
                           )}

                           <div className="text-left flex-1 space-y-2 text-[11px] font-bold" dir="ltr">
                              <p className="flex justify-between border-b border-black/20 pb-1">
                                <span>Subject:</span>
                                <span className="uppercase">{allTextbooks?.find(t => t.id === (selectedTextbookId || activeTextbookId))?.subject || 'Assessment'}</span>
                              </p>
                              <p className="flex justify-between border-b border-black/20 pb-1">
                                <span>Date:</span>
                                <span>{new Date().toLocaleDateString(locale)}</span>
                              </p>
                              <p className="flex justify-between border-b border-black/20 pb-1">
                                <span>Teacher:</span>
                                <span>{teacherName || '...'}</span>
                              </p>
                           </div>
                        </div>

                        {/* Title Section */}
                        <div className="text-center mb-12">
                           <h2 className="text-xl font-black uppercase tracking-[0.2em] border-y-2 border-black py-3 inline-block px-12">
                             {output.examTitle || (locale === 'ar' ? 'اختبار نهاية الفصل' : 'Term Assessment')}
                           </h2>
                        </div>

                        {/* Sections & Questions Container */}
                        <div className="space-y-12">
                           {(output.sections || [{ questions: output.questions }]).map((section: any, sIdx: number) => (
                              <div key={sIdx} className="space-y-6">
                                 {/* Section Header */}
                                 {section.sectionTitle && (
                                    <div className="border-b-2 border-black/80 pb-2 mb-6 page-break-after-avoid">
                                       <h3 className="text-md font-black uppercase tracking-tight">
                                          {section.sectionTitle}
                                       </h3>
                                       {section.instructions && (
                                          <p className="text-[11px] font-medium opacity-70 italic mt-1">
                                             * {section.instructions}
                                          </p>
                                       )}
                                    </div>
                                 )}

                                 <div className="space-y-6">
                                    {section.questions?.map((q: any, i: number) => {
                                       // Calculate a stable global index for editing
                                       const sectionOffset = (output.sections?.slice(0, sIdx).reduce((acc: number, s: any) => acc + (s.questions?.length || 0), 0) || 0);
                                       const globalIdx = sectionOffset + i;
                                       
                                       return (
                                          <div 
                                             key={i} 
                                             className={cn(
                                                "relative rounded-xl transition-all duration-300 group/q p-4 -mx-4",
                                                editingIndex === globalIdx ? "bg-primary/5 ring-1 ring-primary/10 shadow-sm" : "hover:bg-slate-50/80 cursor-pointer"
                                             )}
                                             onClick={() => editingIndex === null && setEditingIndex(globalIdx)}
                                          >
                                             <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                   <div className="flex items-center gap-3 mb-1">
                                                      <span className="flex items-center justify-center w-7 h-7 bg-black text-white rounded-full text-xs font-black shrink-0">
                                                         {globalIdx + 1}
                                                      </span>
                                                      <Badge variant="outline" className="text-[8px] font-black uppercase border-black/10 py-0 h-4">
                                                         {q.type || 'QUESTION'}
                                                      </Badge>
                                                   </div>
                                                   <p className="font-bold text-[15px] leading-relaxed text-slate-900">
                                                      {editingIndex === globalIdx ? (
                                                         <textarea 
                                                            autoFocus
                                                            className="w-full bg-transparent border-none focus:ring-0 resize-none font-bold p-0 min-h-[40px]"
                                                            value={q.text}
                                                            onChange={(e) => {
                                                               if (output.sections) {
                                                                  const newSections = [...output.sections];
                                                                  newSections[sIdx].questions[i].text = e.target.value;
                                                                  setOutput({ ...output, sections: newSections });
                                                               } else {
                                                                  updateQuestion(i, 'text', e.target.value);
                                                               }
                                                            }}
                                                            onBlur={() => setEditingIndex(null)}
                                                         />
                                                      ) : (
                                                         q.text
                                                      )}
                                                   </p>
                                                </div>
                                                <span className="text-[11px] font-black opacity-30 bg-slate-100 px-2 py-1 rounded-md shrink-0 ml-3">
                                                   {q.points || 1} M
                                                </span>
                                             </div>

                                             {/* Options for MCQ with Premium Styling */}
                                             {q.options && q.type?.toLowerCase().includes('mcq') && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 pl-12 pr-6 mt-6">
                                                   {q.options.map((opt: string, oi: number) => (
                                                      <div key={oi} className="text-[14px] flex gap-4 items-start group/opt p-2 hover:bg-slate-50 rounded-lg transition-all">
                                                         <span className="text-[11px] border-[1.5px] border-black rounded-sm w-6 h-6 flex items-center justify-center font-black shrink-0 group-hover/opt:bg-black group-hover/opt:text-white transition-all mt-0.5">
                                                            {String.fromCharCode(65 + oi)}
                                                         </span>
                                                         <div className="flex-1">
                                                            {editingIndex === globalIdx ? (
                                                               <input 
                                                                  className="w-full bg-transparent border-none p-0 text-[14px] focus:ring-0 font-bold text-slate-900"
                                                                  value={opt}
                                                                  onChange={(e) => {
                                                                     const newSections = [...output.sections];
                                                                     newSections[sIdx].questions[i].options[oi] = e.target.value;
                                                                     setOutput({ ...output, sections: newSections });
                                                                  }}
                                                               />
                                                            ) : (
                                                               <span className="font-bold text-slate-800 leading-snug">{opt}</span>
                                                            )}
                                                         </div>
                                                      </div>
                                                   ))}
                                                </div>
                                             )}

                                             {/* Premium Matching Layout */}
                                             {q.matchingPairs && (
                                                <div className="mt-8 px-12 space-y-4">
                                                   <div className="grid grid-cols-2 gap-20 font-black text-[10px] uppercase opacity-40 mb-2">
                                                      <span>Column A</span>
                                                      <span>Column B</span>
                                                   </div>
                                                   <div className="space-y-4">
                                                      {q.matchingPairs.map((pair: any, pIdx: number) => (
                                                         <div key={pIdx} className="grid grid-cols-2 gap-20 items-center">
                                                            <div className="flex gap-4 items-center">
                                                               <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black">{pIdx + 1}</span>
                                                               <span className="font-bold text-[13px]">{pair.sideA}</span>
                                                            </div>
                                                            <div className="flex gap-4 items-center">
                                                               <div className="w-10 h-6 border border-black/20 rounded-md" />
                                                               <span className="font-bold text-[13px] tracking-tight">{pair.sideB}</span>
                                                            </div>
                                                         </div>
                                                      ))}
                                                   </div>
                                                </div>
                                             )}

                                             {/* Visual Divider for Essay/Blanks */}
                                             {(q.type?.toLowerCase().includes('essay') || q.type?.toLowerCase().includes('blank')) && (
                                                <div className="space-y-6 mt-8 px-10 opacity-[0.08]">
                                                   <div className="h-px bg-black w-full" />
                                                   {q.type?.toLowerCase().includes('essay') && (
                                                      <>
                                                         <div className="h-px bg-black w-full" />
                                                         <div className="h-px bg-black w-full" />
                                                      </>
                                                   )}
                                                </div>
                                             )}
                                             
                                             {/* True/False Aesthetic Alignment */}
                                             {(q.type?.toLowerCase().includes('true') || q.type?.toLowerCase().includes('صح')) && !q.options && (
                                                <div className="flex gap-10 pl-10 mt-4">
                                                   <div className="flex items-center gap-3">
                                                      <div className="w-5 h-5 border-2 border-slate-300 rounded-md group-hover/q:border-slate-400 transition-colors" />
                                                      <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{isRTL ? 'صحيح' : 'True'}</span>
                                                   </div>
                                                   <div className="flex items-center gap-3">
                                                      <div className="w-5 h-5 border-2 border-slate-300 rounded-md group-hover/q:border-slate-400 transition-colors" />
                                                      <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{isRTL ? 'خطأ' : 'False'}</span>
                                                   </div>
                                                </div>
                                             )}

                                             {/* Taxonomy Tag (Hidden from Print) */}
                                             <div className="absolute top-2 right-2 opacity-0 group-hover/q:opacity-100 transition-opacity print:hidden">
                                                <Badge variant="secondary" className="text-[9px] font-black uppercase bg-primary/10 text-primary border-none shadow-none">
                                                   {q.taxonomyLevel || 'Standard'}
                                                </Badge>
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>
                           ))}
                        </div>

                        {/* Professional Footer */}
                        <div className="mt-20 pt-8 border-t border-black/5 flex justify-between items-end text-[9px] text-slate-400 font-medium">
                           <div className="flex flex-col gap-1">
                               <span>AI BRIDGE • ACADEMIC ECOSYSTEM</span>
                               <span className="font-bold text-slate-300">CONFIDENTIAL & STANDARDIZED</span>
                           </div>
                           <div className="text-right flex flex-col items-end gap-2">
                               <div className="w-24 h-px bg-slate-200" />
                               <span className="font-bold">FINAL SCORE: ____ / ____</span>
                           </div>
                        </div>
                    </div>

                    {/* Marking Scheme Section (Not in PDF) */}
                    {output.markingScheme && (
                        <div className="mt-8 bg-slate-900 text-slate-300 rounded-3xl p-8 border border-white/5 shadow-2xl overflow-hidden relative group/scheme">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <FileText className="w-20 h-20" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                {locale === 'ar' ? 'دليل التصحيح ونموذج الإجابة' : 'Marking Scheme & Answer Key'}
                            </h4>
                            <div className="space-y-4">
                                {Object.entries(output.markingScheme).map(([idx, ans]: [string, any]) => (
                                    <div key={idx} className="border-l-2 border-primary/30 pl-4 py-1">
                                        <p className="text-xs font-bold text-white leading-tight">Q{idx}: {typeof ans === 'string' ? ans : ans.answer}</p>
                                        {ans.explanation && <p className="text-[10px] mt-1 opacity-60 italic">{ans.explanation}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
              </div>
           )}
        </div>
      </div>
    </ToolPanel>
  );
}
