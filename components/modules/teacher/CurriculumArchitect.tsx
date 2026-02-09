"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ToolPanel, ProgressBar } from './shared/ToolPanel';
import { BookProcessor } from './shared/BookProcessor';
import { db, Textbook, Lesson } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar, BookOpen, Settings2, RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { CalendarUtils, CalendarEvent } from "@/lib/calendar-utils";
import { Badge } from '@/components/Badge';
import { SmartCalendarEngine } from '@/lib/calendar-engine';

interface CurriculumArchitectProps {
  locale: 'en' | 'ar';
  profession?: string;
  toolSlug?: string;
}

export function CurriculumArchitect({ locale }: CurriculumArchitectProps) {
  const isRTL = locale === 'ar';
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'onboarding' | 'ingestion' | 'planning'>('onboarding');
  
  // State for onboarding wizard
  const [config, setConfig] = useState({
     institutionType: 'school', // school | university
     startDate: new Date().toISOString().split('T')[0],
     endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
     frequency: 3, // Lessons per week
  });

  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  // Dexie hooks
  const books = useLiveQuery(() => db.textbooks.toArray());
  const lessons = useLiveQuery(() => db.lessons.where('textbookId').equals(selectedBookId || -1).toArray(), [selectedBookId]);

  // Handle URL Deep Linking (e.g., ?bookId=123)
  useEffect(() => {
    const bookIdParam = searchParams.get('bookId');
    if (bookIdParam && books) {
        const id = parseInt(bookIdParam);
        if (!isNaN(id)) {
            setSelectedBookId(id);
        }
    }
  }, [searchParams, books]);

  // Handle Persistence: If lessons exist for selected book, show planning view immediately
  useEffect(() => {
    if (selectedBookId && lessons && lessons.length > 0) {
        setStep('planning');
    }
  }, [selectedBookId, lessons]);

  const handleGenerateSchedule = async () => {
    if (!selectedBookId) return;
    
    // Simple Algo: Divide book pages evenly across dates
    // In real app: Use chapter breaks
    const start = new Date(config.startDate);
    const end = new Date(config.endDate);
    const weeks = Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const totalSlots = weeks * config.frequency;

    toast.loading(locale === 'ar' ? 'جاري توزيع المنهج الذكي...' : 'Calculating adaptive timeline...');
    
    // Get schedule from textbook if available, else use config
    const activeBook = books?.find(b => b.id === selectedBookId);
    const weeklySchedule = activeBook?.schedule || []; // If subject was added via SubjectStore, it has a schedule.
    
    // If no schedule in DB, we fall back to a generated one based on 'frequency' for now
    // Actually, SmartCalendarEngine needs specific days. Let's assume Mon-Fri if empty.
    const effectiveSchedule = weeklySchedule.length > 0 ? weeklySchedule : [1, 2, 3, 4, 5];

    const teachingDays = SmartCalendarEngine.generateTeachingDays({
        startDate: new Date(config.startDate),
        endDate: new Date(config.endDate),
        weeklySchedule: effectiveSchedule,
        holidays: [] // To be fetched from DB later
    });

    await db.transaction('rw', db.lessons, async () => {
        await db.lessons.where('textbookId').equals(selectedBookId).delete();
        
        // Distribute chapters across available days
        // If we have chapters, we use them. If not, we generate "Lesson X"
        // In a real scenario, we might have more chapters than days or vice versa.
        // For this MVP improvement, we'll try to map 1:1 if possible, or spread them.
        
        const sourceUnits = activeBook?.chapters && activeBook.chapters.length > 0 
            ? activeBook.chapters 
            : Array.from({ length: teachingDays.length }).map((_, i) => ({ 
                title: locale === 'ar' ? `الدرس ${i + 1}` : `Lesson ${i + 1}`,
                context: ''
              }));

        for (let i = 0; i < teachingDays.length; i++) {
            // content cycling or stretching
            const contentIndex = Math.min(i, sourceUnits.length - 1); 
            // If we have fewer chapters than days, we might want to split chapters? 
            // For now, let's just stop or repeat "Review" if we run out, 
            // OR simpler: Map available chapters to the FIRST N days, then "Review/Exam" for the rest?
            // Let's stick to the simpler 1-to-1 for available, then generic for overflow to avoid crashes.
            
            const unit = sourceUnits[contentIndex] || { title: `Lesson ${i+1}`, context: '' };
            
            // Intelligence: If sourceUnits has only 1 item and it's the "General Content" fallback,
            // we should NOT use it as the title for every lesson. We should revert to "Lesson X" numbering
            // but keep the context.
            const isFallbackContent = sourceUnits.length === 1 && sourceUnits[contentIndex]?.context === 'Generated Fallback';

            const displayTitle = (isFallbackContent || i >= sourceUnits.length)
                ? (locale === 'ar' ? `الدرس ${i + 1}` : `Lesson ${i + 1}`) // Revert to standard numbering
                : unit.title;

            // If it's fallback content, we use the general context for all lessons.
            // If it's a real chapter but we ran out (overflow), we use generic context.
            const displayContext = isFallbackContent 
                ? unit.context 
                : (unit.context || (locale === 'ar' ? `سياق الدرس: ${displayTitle}` : `Context for ${displayTitle}`));

            await db.lessons.add({
                textbookId: selectedBookId,
                title: displayTitle,
                date: teachingDays[i],
                status: 'pending',
                weekNumber: Math.floor(i / effectiveSchedule.length) + 1,
                contentContext: displayContext,
                createdAt: new Date()
            });
        }
    });

    toast.dismiss();
    toast.success(locale === 'ar' ? 'تم إنشاء الجدول بنجاح' : 'Schedule created successfully');
    
    // Auto-advance to planning step to show result
    setStep('planning');
  };

  const handleResync = async (lesson: Lesson) => {
     if (!selectedBookId || !lesson.id) return;
     
     try {
       // Find the index of this lesson in the schedule
       const lessonIndex = lessons?.findIndex(l => l.id === lesson.id) || 0;
       
       // Update the textbook's currentLesson field
       await db.textbooks.update(selectedBookId, {
         currentLesson: lessonIndex + 1
       });
       
       // Update the lesson status to 'planned' if it was 'pending'
       if (lesson.status === 'pending') {
         await db.lessons.update(lesson.id, { status: 'planned' });
       }
       
       toast.success(
         locale === 'ar' 
           ? `تم تحديث التقدم: أنت الآن في "${lesson.title}"` 
           : `Progress synced: You're now at "${lesson.title}"`
       );
     } catch (error) {
       console.error('Sync failed:', error);
       toast.error(locale === 'ar' ? 'فشل التحديث' : 'Sync failed');
     }
  };

  const handleExportCalendar = () => {
    if (!lessons || lessons.length === 0) return;
    
    const activeBook = books?.find((b: Textbook) => b.id === selectedBookId);
    const events: CalendarEvent[] = lessons.map(lesson => ({
        title: `📚 ${lesson.title} (${activeBook?.title || ''})`,
        description: `حصة دراسية مجدولة عبر نظام AI Bridge.\nالمحتوى: ${lesson.contentContext || 'غير محدد'}`,
        startTime: new Date(lesson.date), 
        durationMinutes: 45 
    }));

    const icsString = CalendarUtils.generateICS(events);
    CalendarUtils.downloadICS(`${activeBook?.title || 'Schedule'}.ics`, icsString);
    toast.success(locale === 'ar' ? 'تم تجهيز ملف التقويم!' : 'Calendar file ready!');
  };

  return (
    <ToolPanel
      title={locale === 'ar' ? 'مهندس المنهج الذكي' : 'Smart Curriculum Architect'}
      description={locale === 'ar' 
        ? 'نظام جدولة مرن يتكيف مع تقدمك الفعلي ويوزع المنهج تلقائياً.'
        : 'Adaptive scheduling system that calibrates syllabus distribution based on your real classroom progress.'}
      locale={locale}
      icon={<Calendar className="w-8 h-8" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Configuration */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-card/40 backdrop-blur-md border rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center gap-2 mb-2">
                 <Settings2 className="w-5 h-5 text-primary" />
                 <h3 className="font-bold">{locale === 'ar' ? 'إعدادات الفصل الدراسي' : 'Semester Config'}</h3>
              </div>

              {/* Step 1: Select Book */}
              <div className="space-y-3">
                 <Label className="uppercase text-xs font-black text-muted-foreground">{locale === 'ar' ? '1. اختر المادة' : '1. Select Subject'}</Label>
                 
                 {books && books.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">
                       {books.map((book: Textbook) => (
                          <div 
                            key={book.id} 
                            onClick={() => {
                                setSelectedBookId(book.id!);
                                // Auto-fill config if book has it?
                                if(book.semesterStart) setConfig(prev => ({...prev, startDate: book.semesterStart!}));
                                if(book.semesterEnd) setConfig(prev => ({...prev, endDate: book.semesterEnd!}));
                            }}
                            className={cn(
                                "p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group",
                                selectedBookId === book.id 
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                                    : "bg-background hover:border-primary/50"
                            )}
                          >
                             <div className="flex items-center gap-3">
                                 <div className={cn("p-2 rounded-lg", selectedBookId === book.id ? "bg-white/20" : "bg-primary/10 text-primary")}>
                                     <BookOpen className="w-4 h-4" />
                                 </div>
                                 <div className="flex flex-col text-left">
                                     <span className="font-bold text-sm truncate">{book.title}</span>
                                     <span className={cn("text-[10px]", selectedBookId === book.id ? "text-white/80" : "text-muted-foreground")}>
                                         {book.grade || 'General'}
                                     </span>
                                 </div>
                             </div>
                             {selectedBookId === book.id && <CheckCircle2 className="w-5 h-5" />}
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="text-center p-4 border-2 border-dashed rounded-xl text-muted-foreground text-sm">
                        {locale === 'ar' ? 'لا يوجد مواد مضافة' : 'No subjects found'}
                    </div>
                 )}

                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setStep('ingestion')} 
                    className="w-full border-dashed border-primary/30 hover:bg-primary/5 hover:border-primary"
                 >
                    {locale === 'ar' ? '+ رفع كتاب جديد' : '+ Upload New Book'}
                 </Button>
              </div>

              {/* Step 2: Config Dates (Only if book selected) */}
              {selectedBookId && (
                  <div className="space-y-4 pt-4 border-t animate-in slide-in-from-top-2 fade-in">
                     <Label className="uppercase text-xs font-black text-muted-foreground">{locale === 'ar' ? '2. ضبط التواريخ' : '2. Configure Timeline'}</Label>
                     
                     <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <Label className="text-[10px]">{locale === 'ar' ? 'تاريخ البداية' : 'Start Date'}</Label>
                            <Input 
                                type="date" 
                                className="h-9 text-xs"
                                value={config.startDate} 
                                onChange={e => setConfig({...config, startDate: e.target.value})} 
                            />
                         </div>
                         <div className="space-y-1">
                            <Label className="text-[10px]">{locale === 'ar' ? 'تاريخ النهاية' : 'End Date'}</Label>
                            <Input 
                                type="date" 
                                className="h-9 text-xs"
                                value={config.endDate} 
                                onChange={e => setConfig({...config, endDate: e.target.value})} 
                            />
                         </div>
                     </div>
                     
                     <div className="space-y-2">
                        <Label className="text-[10px] flex justify-between">
                            <span>{locale === 'ar' ? 'كثافة الحصص (أسبوعياً)' : 'Weekly Frequency'}</span>
                            <span className="font-bold text-primary">{config.frequency}</span>
                        </Label>
                        <input 
                            type="range" 
                            min="1" max="7" 
                            value={config.frequency} 
                            onChange={e => setConfig({...config, frequency: parseInt(e.target.value)})}
                            className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                            <span>1</span>
                            <span>3</span>
                            <span>5</span>
                            <span>7</span>
                        </div>
                     </div>

                     <Button onClick={handleGenerateSchedule} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 mt-2">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {locale === 'ar' ? 'توزيع المنهج الآن' : 'Distribute Syllabus Now'}
                     </Button>
                  </div>
              )}
           </div>
        </div>

        {/* Right Panel: Content Area */}
        <div className="lg:col-span-8">
           {step === 'ingestion' && (
              <div className="animate-in fade-in zoom-in">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl">{locale === 'ar' ? 'معالج الكتب' : 'Book Ingestion'}</h3>
                    <Button variant="ghost" onClick={() => setStep('planning')}>{locale === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
                 </div>
                 <BookProcessor locale={locale} onComplete={(id) => { setSelectedBookId(id); setStep('planning'); }} />
              </div>
           )}

            {step === 'planning' && (
              <div className="space-y-6">
                 {!lessons || lessons.length === 0 ? (
                    <div className="h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground">
                        <Calendar className="w-16 h-16 mb-4 opacity-20" />
                        <p>{locale === 'ar' ? 'لم يتم إنشاء جدول بعد' : 'No schedule generated yet'}</p>
                        <p className="text-sm">{locale === 'ar' ? 'قم باختيار كتاب واضغط "توزيع المنهج"' : 'Select a book and click "Distribute"'}</p>
                    </div>
                 ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                 <h3 className="font-bold text-xl flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    {books?.find((b: Textbook) => b.id === selectedBookId)?.title} - {locale === 'ar' ? 'الجدول الزمني' : 'Timeline'}
                                 </h3>
                                 <div className="flex gap-2">
                                     {lessons.length > 0 && (
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={handleExportCalendar}
                                            className="gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            {locale === 'ar' ? 'تصدير للتقويم' : 'Export Calendar'}
                                        </Button>
                                     )}
                                     <Button size="sm" variant="outline" onClick={() => window.location.href=`/${locale}/tools/teacher`}>
                                         {locale === 'ar' ? 'عرض الجدول الأسبوعي' : 'View Weekly Schedule'}
                                     </Button>
                                     <Badge variant="outline">{lessons.length} {locale === 'ar' ? 'درس' : 'Lessons'}</Badge>
                                 </div>
                            </div>
                        </div>

                        <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2">
                           {lessons.map((lesson: Lesson, idx: number) => (
                              <div key={lesson.id} className="group flex items-center gap-4 p-4 bg-card border rounded-2xl hover:shadow-md transition-all">
                                 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                                    {idx + 1}
                                 </div>
                                 <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold">{lesson.title}</h4>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                                            {lesson.date.toLocaleDateString(locale)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate max-w-[300px]">{lesson.contentContext}</p>
                                 </div>
                                 <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                      size="sm" 
                                      className="text-xs"
                                      onClick={() => window.location.href = `/${locale}/tools/teacher/lesson-planner?lessonId=${lesson.id}`}
                                    >
                                        {locale === 'ar' ? 'تحضير' : 'Prepare'}
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-xs"
                                      onClick={() => handleResync(lesson)}
                                    >
                                        {locale === 'ar' ? 'أنا هنا' : 'I\'m Here'}
                                    </Button>
                                 </div>
                              </div>
                           ))}
                        </div>
                    </div>
                 )}
              </div>
           )}
        </div>

      </div>
    </ToolPanel>
  );
}
