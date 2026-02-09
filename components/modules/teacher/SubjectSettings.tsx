"use client";

import React, { useState, useCallback } from 'react';
import { useCurriculum } from '@/lib/hooks/use-curriculum-context';
import { db, Textbook } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Settings2, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Trash2,
  Plus,
  Clock,
  Sparkles,
  Info,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumModal } from './shared/PremiumModal';

interface SubjectSettingsProps {
  locale: 'en' | 'ar';
}

export function SubjectSettings({ locale }: SubjectSettingsProps) {
  const isRTL = locale === 'ar';
  const { textbooks, activeTextbookId, setActiveTextbookId } = useCurriculum();
  
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const [step, setStep] = useState(1);
  const [tempFile, setTempFile] = useState<File | null>(null);

  // Mock premium state
  const [isPremium, setIsPremium] = useState(false);
  const [newSubject, setNewSubject] = useState({
    title: '',
    grade: '',
    schedule: [1, 2, 3, 4, 5], // Mon-Fri default
    lessonsPerDay: 1,
    currentLesson: 1, // Phase 31: Curriculum Sync
  });

  const days = [
    { id: 0, label: { en: "Sun", ar: "أحد" } },
    { id: 1, label: { en: "Mon", ar: "اثنين" } },
    { id: 2, label: { en: "Tue", ar: "ثلاثاء" } },
    { id: 3, label: { en: "Wed", ar: "أربعاء" } },
    { id: 4, label: { en: "Thu", ar: "خميس" } },
    { id: 5, label: { en: "Fri", ar: "جمعة" } },
    { id: 6, label: { en: "Sat", ar: "سبت" } },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setTempFile(file);
      setStep(3); // Move to Sync
    } else {
      toast.error(locale === 'ar' ? 'يرجى رفع ملف PDF فقط' : 'Please upload a PDF file only');
    }
  };

  const handleManualFile = (file: File) => {
    setTempFile(file);
    setStep(3);
  };

  const finalizeOnboarding = async () => {
    // Phase 35: Hybrid Magic Flow - Allow starting without a book
    // if (!tempFile) return; // Removed blocking check

    setIsUploading(true);
    try {
      const id = await db.textbooks.add({
        ...newSubject,
        bookFile: tempFile || undefined,
        bookName: tempFile?.name || undefined,
        currentLesson: newSubject.currentLesson || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setActiveTextbookId(id as number);
      toast.success(locale === 'ar' ? 'تمت إضافة المادة بنجاح' : 'Subject added successfully');
      setNewSubject({ title: '', grade: '', schedule: [1,2,3,4,5], lessonsPerDay: 1, currentLesson: 1 });
      setTempFile(null);
      setStep(1);
    } catch (error) {
      console.error(error);
      toast.error(locale === 'ar' ? 'فشل الحفظ' : 'Save failed');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleDay = (dayId: number) => {
    setNewSubject(prev => ({
      ...prev,
      schedule: prev.schedule.includes(dayId)
        ? prev.schedule.filter(id => id !== dayId)
        : [...prev.schedule, dayId].sort()
    }));
  };

  const deleteSubject = async (id: number) => {
    if (confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذه المادة؟' : 'Are you sure you want to delete this subject?')) {
      await db.textbooks.delete(id);
      await db.lessons.where('textbookId').equals(id).delete();
      if (activeTextbookId === id) setActiveTextbookId(null);
      toast.success(locale === 'ar' ? 'تم الحذف' : 'Deleted');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Link href={`/${locale}/tools/teacher`} className={cn("mt-1 p-2 rounded-full hover:bg-muted transition-colors", isRTL && "rotate-180")}>
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h2 className="text-2xl font-black">{locale === 'ar' ? 'معالج بناء الهوية' : 'Identity Wizard'}</h2>
            <p className="text-muted-foreground">{locale === 'ar' ? 'أهلاً بك زميلي المعلم، لنقم بتجهيز بيئة عملك في 3 خطوات.' : 'Welcome teacher, let\'s setup your workspace in 3 steps.'}</p>
          </div>
        </div>
        <div className="bg-primary/10 p-3 rounded-2xl text-primary flex gap-2">
            {[1, 2, 3].map(s => (
                <div key={s} className={cn("w-2 h-2 rounded-full transition-all", step === s ? "bg-primary w-6" : "bg-primary/20")} />
            ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* New Subject Form Wizard */}
        <section className="bg-card/40 backdrop-blur-md border border-border/40 rounded-[2.5rem] p-8 shadow-xl relative min-h-[450px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                className="space-y-6 flex-grow"
              >
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-primary">
                        {locale === 'ar' ? 'المحطة 1: بناء الهوية' : 'Step 1: Identity'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {locale === 'ar' ? 'ما هي المادة التي تدرسها؟ ولأي صف؟' : 'What subject do you teach? And for which grade?'}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>{locale === 'ar' ? 'اسم المادة' : 'Subject Name'}</Label>
                        <Input 
                        value={newSubject.title}
                        onChange={e => setNewSubject({...newSubject, title: e.target.value})}
                        placeholder={locale === 'ar' ? 'مثال: كيمياء' : 'e.g. Chemistry'}
                        className="rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{locale === 'ar' ? 'الصف' : 'Grade'}</Label>
                        <Input 
                        value={newSubject.grade}
                        onChange={e => setNewSubject({...newSubject, grade: e.target.value})}
                        placeholder={locale === 'ar' ? 'العاشر' : '10th'}
                        className="rounded-xl"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {locale === 'ar' ? 'الجدول الأسبوعي' : 'Weekly Schedule'}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {days.map(day => (
                        <button
                            key={day.id}
                            onClick={() => toggleDay(day.id)}
                            className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                            newSubject.schedule.includes(day.id)
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "bg-background/50 text-muted-foreground border-border/50 hover:border-primary/30"
                            )}
                        >
                            {day.label[locale]}
                        </button>
                        ))}
                    </div>
                </div>

                <Button 
                    onClick={() => {
                        if (!newSubject.title || !newSubject.grade) {
                            toast.error(locale === 'ar' ? 'يرجى إدخال اسم المادة والصف للمتابعة' : 'Please enter Subject Name and Grade to continue');
                            return;
                        }
                        setStep(2);
                    }}
                    className="w-full h-12 rounded-2xl font-bold mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                    {locale === 'ar' ? 'المتابعة للمحطة التالية' : 'Continue to Next Step'}
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                className="space-y-6 flex-grow"
              >
                 <div className="space-y-2">
                    <h3 className="text-xl font-bold text-primary">
                        {locale === 'ar' ? 'المحطة 2: حقن الذكاء' : 'Step 2: Textbook Injection'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {locale === 'ar' ? 'لكي نكون دقيقين، نحتاج لنسخة من كتابك (PDF).' : 'To be precise, we need a copy of your textbook (PDF).'}
                    </p>
                </div>

                <div 
                    className={cn(
                    "relative border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all duration-300 min-h-[200px]",
                    dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border/60 hover:border-primary/30",
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold">
                        {locale === 'ar' ? 'اسحب ملف الكتاب هنا' : 'Drop textbook PDF here'}
                    </p>
                    <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        accept=".pdf"
                        onChange={e => e.target.files?.[0] && handleManualFile(e.target.files[0])}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => setStep(1)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors font-bold"
                    >
                        {locale === 'ar' ? '← العودة للخلف' : '← Go Back'}
                    </button>
                    <button 
                         onClick={() => setStep(3)}
                         className="text-xs text-muted-foreground hover:text-primary transition-colors font-bold flex items-center gap-1"
                    >
                        {locale === 'ar' ? 'تخطي هذه الخطوة' : 'Skip for Now'}
                        <span className="text-[10px] bg-muted px-1.5 rounded opacity-70">Optional</span>
                    </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
                <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    className="space-y-6 flex-grow"
                >
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-primary">
                            {locale === 'ar' ? 'المحطة 3: مزامنة الزمن' : 'Step 3: Temporal Sync'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {locale === 'ar' ? 'أين أنت الآن؟ اختر الدرس الذي ستبدأ بشرحه غداً.' : 'Where are you now? Choose the lesson you will start tomorrow.'}
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-bold">
                                {tempFile ? tempFile.name : (locale === 'ar' ? 'بدون كتاب مدرسي (سيتم التفعيل لاحقاً)' : 'No Textbook (Manual Mode)')}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <Label>{locale === 'ar' ? 'رقم الدرس الحالي' : 'Current Lesson Number'}</Label>
                            <Input 
                                type="number"
                                min={1}
                                value={newSubject.currentLesson}
                                onChange={e => setNewSubject({...newSubject, currentLesson: parseInt(e.target.value)})}
                                className="rounded-xl h-12 text-lg font-bold"
                            />
                            <p className="text-[10px] text-muted-foreground uppercase font-black">
                                {locale === 'ar' ? 'سيتم تجاهل الدروس السابقة في الجدول.' : 'Past lessons will be silenced in the schedule.'}
                            </p>
                        </div>
                    </div>

                    <Button 
                        disabled={isUploading}
                        onClick={finalizeOnboarding}
                        className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
                    >
                        {isUploading ? (locale === 'ar' ? 'جاري المعالجة...' : 'Processing...') : (
                            tempFile 
                                ? (locale === 'ar' ? 'إطلاق المادة 🚀' : 'Launch Subject 🚀')
                                : (locale === 'ar' ? 'إنشاء المادة ⚡' : 'Create Subject ⚡')
                        )}
                    </Button>

                    <button 
                        onClick={() => setStep(2)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors font-bold"
                    >
                        {locale === 'ar' ? '← تغيير الملف' : '← Change File'}
                    </button>
                </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Existing Subjects List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold">{locale === 'ar' ? 'المواد المضافة' : 'Your Subjects'}</h3>
            <span className="text-xs font-black text-primary/60 uppercase tracking-tighter">
              {textbooks?.length || 0} {locale === 'ar' ? 'مواد' : 'Subjects'}
            </span>
          </div>

          <div className="grid gap-4">
            {textbooks?.map(subject => (
              <motion.div
                key={subject.id}
                layout
                className={cn(
                  "group relative overflow-hidden rounded-3xl border bg-card/60 p-6 flex items-center justify-between transition-all",
                  activeTextbookId === subject.id ? "border-primary shadow-lg ring-1 ring-primary/20" : "hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 h-14 w-14 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-lg">{subject.title}</h4>
                      {subject.grade && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black uppercase">
                          {subject.grade}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {subject.schedule?.length} {locale === 'ar' ? 'أيام' : 'days'}
                      </span>
                      <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                      <span className="flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {subject.bookName ? (locale === 'ar' ? 'كتاب مرفوع' : 'Book uploaded') : (locale === 'ar' ? 'لا يوجد كتاب' : 'No book')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveTextbookId(subject.id!)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      activeTextbookId === subject.id 
                        ? "bg-green-500 text-white" 
                        : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                    )}
                  >
                    {activeTextbookId === subject.id ? (locale === 'ar' ? 'نشط' : 'Active') : (locale === 'ar' ? 'تفعيل' : 'Activate')}
                  </button>
                  <button 
                    onClick={() => {
                        setNewSubject({
                            title: subject.title,
                            grade: subject.grade || '',
                            schedule: subject.schedule || [],
                            lessonsPerDay: subject.lessonsPerDay || 1,
                            currentLesson: subject.currentLesson || 1
                        });
                        setStep(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteSubject(subject.id!)}
                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            {(!textbooks || textbooks.length === 0) && (
              <div className="py-20 text-center border-2 border-dashed border-border/40 rounded-[2.5rem] bg-muted/5 opacity-50">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
                <p className="text-muted-foreground">{locale === 'ar' ? 'لم تضف أي مواد بعد' : 'No subjects added yet'}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Integration Tip */}
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-[2rem] border border-primary/10 flex items-start gap-4">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">{locale === 'ar' ? 'قوة السياق:' : 'The Power of Context:'}</strong>{' '}
          {locale === 'ar' 
            ? 'عند رفع كتاب المادة، سيقوم محركنا باستخراج المفاهيم الأساسية والأهداف التعليمية تلقائياً لاستخدامها في التحضير والاختبارات.'
            : 'When you upload a textbook, our engine extracts key concepts and learning objectives automatically to use in your planning and assessments.'}
        </p>
      </div>

      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        locale={locale} 
      />
    </div>
  );
}
