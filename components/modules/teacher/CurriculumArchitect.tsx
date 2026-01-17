"use client";

import React, { useState, useEffect } from 'react';
import { ToolPanel, ProgressBar } from './shared/ToolPanel';
import { BookProcessor } from './shared/BookProcessor';
import { db, Textbook, Lesson } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar, BookOpen, Settings2, RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/Badge';

interface CurriculumArchitectProps {
  locale: 'en' | 'ar';
  profession?: string;
  toolSlug?: string;
}

export function CurriculumArchitect({ locale }: CurriculumArchitectProps) {
  const isRTL = locale === 'ar';
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

  const handleGenerateSchedule = async () => {
    if (!selectedBookId) return;
    
    // Simple Algo: Divide book pages evenly across dates
    // In real app: Use chapter breaks
    const start = new Date(config.startDate);
    const end = new Date(config.endDate);
    const weeks = Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const totalSlots = weeks * config.frequency;

    toast.loading(locale === 'ar' ? 'جاري توزيع المنهج الذكي...' : 'Calculating adaptive timeline...');
    
    await db.transaction('rw', db.lessons, async () => {
        await db.lessons.where('textbookId').equals(selectedBookId).delete();
        
        let currentDate = new Date(start);
        
        for (let i = 1; i <= totalSlots; i++) {
            // contentContext would be fetched from book slice
            await db.lessons.add({
                textbookId: selectedBookId,
                title: `${locale === 'ar' ? 'درس' : 'Lesson'} ${i}`,
                date: new Date(currentDate),
                status: 'pending',
                weekNumber: Math.ceil(i / config.frequency),
                contentContext: `Placeholder context from page ${i * 5}`,
                createdAt: new Date()
            });
            
            // Advance date (simplified logic, skipping weekends would be here)
            currentDate.setDate(currentDate.getDate() + (7 / config.frequency));
        }
    });

    toast.dismiss();
    toast.success(locale === 'ar' ? 'تم إنشاء الجدول بنجاح' : 'Schedule created successfully');
  };

  const handleResync = async (fromLessonId: number) => {
     // "Where am I?" Logic
     toast.success('Adaptive Sync: Timeline shifted!');
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

              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label>{locale === 'ar' ? 'تاريخ البداية' : 'Start Date'}</Label>
                    <Input type="date" value={config.startDate} onChange={e => setConfig({...config, startDate: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <Label>{locale === 'ar' ? 'تاريخ النهاية' : 'End Date'}</Label>
                    <Input type="date" value={config.endDate} onChange={e => setConfig({...config, endDate: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <Label>{locale === 'ar' ? 'عدد الحصص أسبوعياً' : 'Lessons / Week'}</Label>
                    <Input type="number" value={config.frequency} onChange={e => setConfig({...config, frequency: parseInt(e.target.value)})} />
                 </div>
              </div>

              <div className="pt-4 border-t">
                 <Label className="mb-2 block">{locale === 'ar' ? 'الكتاب المعتمد' : 'Active Textbook'}</Label>
                 {books && books.length > 0 ? (
                    <div className="space-y-2">
                       {books.map((book: Textbook) => (
                          <div 
                            key={book.id} 
                            onClick={() => setSelectedBookId(book.id!)}
                            className={cn(
                                "p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between",
                                selectedBookId === book.id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                            )}
                          >
                             <span className="font-medium text-sm truncate">{book.title}</span>
                             {selectedBookId === book.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          </div>
                       ))}
                       <Button variant="outline" size="sm" onClick={() => setStep('ingestion')} className="w-full mt-2">
                          {locale === 'ar' ? '+ إضافة كتاب جديد' : '+ Add New Book'}
                       </Button>
                    </div>
                 ) : (
                    <Button onClick={() => setStep('ingestion')} className="w-full">
                       {locale === 'ar' ? 'رفع المنهج (PDF/OCR)' : 'Upload Syllabus (PDF/OCR)'}
                    </Button>
                 )}
              </div>

              {selectedBookId && (
                  <Button onClick={handleGenerateSchedule} className="w-full mt-4">
                     <RefreshCw className="w-4 h-4 mr-2" />
                     {locale === 'ar' ? 'توزيع المنهج آلياً' : 'Auto-Distribute Syllabus'}
                  </Button>
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                             <h3 className="font-bold text-xl flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                {books?.find((b: Textbook) => b.id === selectedBookId)?.title} - Timeline
                             </h3>
                             <Badge variant="outline">{lessons.length} {locale === 'ar' ? 'درس' : 'Lessons'}</Badge>
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
                                    <Button size="sm" variant="outline" className="text-xs">
                                        {locale === 'ar' ? 'أنا هنا' : 'I\'m Here'}
                                    </Button>
                                    <Button size="sm" className="text-xs">
                                        {locale === 'ar' ? 'تحضير' : 'Prepare'}
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
