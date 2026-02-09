"use client";

import React, { useEffect } from "react";

import { FileText, ClipboardList, PenTool, ArrowRight, Sparkles, Calendar, Database, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { cn } from "@/lib/utils";
import { useActiveLesson } from "@/lib/hooks/use-active-lesson";
import { usePedagogicalCoach } from "@/lib/hooks/use-pedagogical-coach";
import { RecommendedToolCard } from "@/components/RecommendedToolCard";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ar as arLocale, enUS as enLocale } from "date-fns/locale";
import { DailyTip } from "./teacher/DailyTip";
import { GuideOverlay } from "./teacher/GuideOverlay";
import { ScheduleWidget } from "./teacher/ScheduleWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ImpactStatsWidget } from "./teacher/ImpactStatsWidget";
import { motion } from "framer-motion";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { LivingAssistantHeader } from "./teacher/LivingAssistantHeader";
import { ProactiveActionHub } from "./teacher/ProactiveActionHub";
import { useAuth } from "@/lib/hooks/use-auth";
import { SyncEngine } from "@/lib/sync-engine";

interface TeacherModuleProps {
  locale: "en" | "ar";
  profession?: string;
  toolSlug?: string;
}

const TOOLS = [
  {
    id: "exam-generator",
    title: { en: "AI Exam Generator", ar: "مولد الاختبارات الذكي" },
    description: { en: "Precision engine for creating assessments from PDFs or topics.", ar: "محرك دقيق لإنشاء الاختبارات من ملفات PDF أو المواضيع." },
    icon: FileText,
    color: "bg-blue-500",
    slug: "exam-generator"
  },
  {
    id: "lesson-planner",
    title: { en: "Lesson Architect", ar: "مهندس التحضير" },
    description: { en: "Build structured 45-minute lesson plans for any grade level.", ar: "ابنِ خطط دروس منظمة لمدة 45 دقيقة لأي مستوى دراسي." },
    icon: ClipboardList,
    color: "bg-amber-500",
    slug: "lesson-planner"
  },
  {
    id: "smart-grader",
    title: { en: "AI Smart Grader", ar: "المصحح الذكي" },
    description: { en: "Analyze student answers and provide constructive feedback.", ar: "حلل إجابات الطلاب وقدم ملاحظات بناءة فورية." },
    icon: PenTool,
    color: "bg-green-500",
    slug: "smart-grader"
  },
  {
    id: "curriculum-architect",
    title: { en: "Curriculum Architect", ar: "مهندس المنهج" },
    description: { en: "Adaptive scheduling and syllabus distribution.", ar: "جدولة مرنة وتوزيع ذكي للمنهج الدراسي." },
    icon: Calendar,
    color: "bg-purple-500",
    slug: "curriculum-architect"
  },
  {
    id: "subject-store",
    title: { en: "Subject Store", ar: "مخزن المواد" },
    description: { en: "Centralized hub for your textbooks, files, and weekly schedules.", ar: "المستودع المركزي لكتيباتك، ملفاتك، وجدولك الأسبوعي." },
    icon: Database,
    color: "bg-slate-700",
    slug: "subjects"
  }
];

export function TeacherModule({ locale, profession, toolSlug }: TeacherModuleProps) {
  const { user } = useAuth();
  const activeLessonData = useActiveLesson();

  // Sync logic (Phase 50)
  useEffect(() => {
    if (user) {
        SyncEngine.fullSync(user.id, locale);
    }
  }, [user, locale]);

  const expertInsights = usePedagogicalCoach();
  const router = useRouter();

  const nextPendingLesson = useLiveQuery(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return db.lessons
      .where('date')
      .aboveOrEqual(today)
      .filter(l => l.status === 'pending')
      .toArray()
      .then(list => list.sort((a,b) => a.date.getTime() - b.date.getTime())[0]);
  }, []);

  const navigateWithContext = (toolSlug: string, lessonId: number) => {
    router.push(`/${locale}/tools/teacher/${toolSlug}?lessonId=${lessonId}`);
  };

  const handleMagicPrep = (lessonId: number) => {
    router.push(`/${locale}/tools/teacher/lesson-planner?lessonId=${lessonId}&auto=true`);
  };

  const getTemporalGreeting = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 4 = Thu
    const hour = now.getHours();

    if (locale === 'ar') {
        if (day === 4) return "الخميس الونيس! هل تريد تخطيط الأسبوع القادم بالكامل؟ 📅";
        if (day === 0 && hour < 12) return "صباح الأحد المشرق. إليك لمحة سريعة عن حصص اليوم ☀️";
        return "غرفة عمليات الدرس: جاهز للإبداع اليوم؟";
    }

    if (day === 4) return "Happy Thursday! Want to plan your entire next week? 📅";
    if (day === 0 && hour < 12) return "Sunday Morning. Here's your daily briefing ☀️";
    return "Lesson Control Room: Ready to create today?";
  };

  return (
    <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-8">
      <Breadcrumbs 
        items={[
            { label: locale === 'ar' ? 'الرئيسية' : 'Hub', href: `/${locale}` },
            { label: locale === 'ar' ? 'نظام المعلم' : 'Teacher OS', href: `/${locale}/tools/teacher` }
        ]} 
        locale={locale} 
      />
      
      <ImpactStatsWidget locale={locale} />

      <GuideOverlay locale={locale} />
      
      {/* Focus UI: DailyStatusCard (Phase 32) */}
      <div className="relative p-8 rounded-[3rem] bg-slate-900 text-white overflow-hidden shadow-2xl border border-white/5">
         <div className="absolute top-0 right-0 p-48 bg-primary/20 rounded-full blur-[120px] -mr-24 -mt-24 pointer-events-none" />
         <div className="absolute bottom-0 left-0 p-40 bg-blue-500/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
         
         <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <LivingAssistantHeader locale={locale} />
                
                {/* Daily Briefing / Smart Prep Action (Phase 46) */}
                {!activeLessonData && nextPendingLesson && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="p-5 rounded-[2rem] bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-xl border border-white/10 flex items-center justify-between gap-6 group hover:shadow-2xl hover:shadow-blue-500/10 transition-all max-w-xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/40 shrink-0">
                                <Sparkles size={28} className="animate-pulse" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-1">Magic Recommendation</p>
                                <h4 className="text-lg font-black text-white leading-tight">
                                    {locale === 'ar' ? `استعد لدرس "${nextPendingLesson.title}"` : `Prepare for "${nextPendingLesson.title}"`}
                                </h4>
                                <p className="text-sm text-blue-200/50 mt-1">
                                    {locale === 'ar' ? 'هل تود تحضير المادة العلمية الآن بضغطة واحدة؟' : 'Want to auto-generate the lesson kit now?'}
                                </p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => handleMagicPrep(nextPendingLesson.id!)}
                            className="bg-white text-blue-600 hover:bg-blue-50 rounded-2xl px-6 py-6 font-black h-auto shrink-0 shadow-xl"
                        >
                            {locale === 'ar' ? 'ابدأ التحضير ✨' : 'One-Click Prep ✨'}
                        </Button>
                    </motion.div>
                )}

                {!activeLessonData && !nextPendingLesson && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-4 group hover:bg-white/15 transition-all cursor-pointer"
                        onClick={() => router.push(`/${locale}/tools/teacher/subjects`)}
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Database size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-tighter text-blue-300">Smart Recommendation</p>
                            <p className="text-sm font-bold">
                                {locale === 'ar' ? 'ابدأ بتنظيم موادك لغدٍ أفضل' : 'Organize your subjects for a better tomorrow'}
                            </p>
                        </div>
                        <ArrowRight size={16} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                )}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Operational Insight</p>
                        <h2 className="text-xs font-bold text-slate-300">{getTemporalGreeting()}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/${locale}/tools/teacher/subjects`}>
                        <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title={locale === 'ar' ? 'إدارة المواد' : 'Manage Subjects'}>
                            <Database className="w-5 h-5" />
                        </button>
                    </Link>
                    {activeLessonData && (
                        <Badge className="bg-white/10 text-white border-white/20 px-3 py-1">
                            {activeLessonData.type === 'today' ? '🔴 LIVE' : '🔜 NEXT'}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
               <div className="space-y-3">
                  <h3 className="text-5xl font-black tracking-tighter">
                     {activeLessonData ? activeLessonData.lesson.title : (locale === 'ar' ? 'أكمل الإعداد للبدء' : 'Complete Setup to Start')}
                  </h3>
                  {activeLessonData && (
                      <p className="text-xl text-slate-400 font-medium">
                        {format(activeLessonData.lesson.date, 'EEEE, d MMMM', { locale: locale === 'ar' ? arLocale : enLocale })}
                      </p>
                  )}
               </div>

               {activeLessonData ? (
                 <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => navigateWithContext('lesson-planner', activeLessonData?.lesson.id!)}
                        className="btn-focus group bg-primary hover:bg-primary/90 text-white"
                    >
                        <ClipboardList className="w-6 h-6 transition-transform group-hover:scale-110" />
                        <span className="font-black text-lg">{locale === 'ar' ? 'تحضير' : 'Plan'}</span>
                    </button>
                    <button 
                        onClick={() => navigateWithContext('exam-generator', activeLessonData?.lesson.id!)}
                        className="btn-focus group bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    >
                        <FileText className="w-6 h-6 transition-transform group-hover:rotate-6" />
                        <span className="font-bold text-lg">{locale === 'ar' ? 'اختبار' : 'Exam'}</span>
                    </button>
                    <button 
                        className="btn-focus group bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    >
                        <PenTool className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
                        <span className="font-bold text-lg">{locale === 'ar' ? 'نشاط' : 'Activity'}</span>
                    </button>
                    <style jsx>{`
                        .btn-focus {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: 0.75rem;
                            width: 100px;
                            height: 100px;
                            border-radius: 2rem;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        .btn-focus:hover {
                            transform: translateY(-8px) scale(1.05);
                        }
                    `}</style>
                 </div>
               ) : (
                <Link 
                    href={`/${locale}/tools/teacher/subjects`}
                    className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-lg hover:bg-primary/90 transition-all flex items-center gap-3"
                >
                    {locale === 'ar' ? 'ابدأ معالج الإعداد' : 'Start Onboarding Wizard'}
                    <ArrowRight className={locale === 'ar' ? 'rotate-180' : ''} />
                </Link>
               )}
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
        {/* Phase 36: Smart Schedule Widget */}
        <ScheduleWidget locale={locale} />
      </div>

       <ProactiveActionHub locale={locale} />

       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
        <div className="space-y-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest">
                Professional Suite
            </Badge>
            <h2 className="text-3xl font-black">{locale === 'en' ? 'Teacher OS' : 'نظام تشغيل المعلم'}</h2>
            <p className="text-muted-foreground">{locale === 'en' ? 'Select a specialized control panel below.' : 'اختر لوحة التحكم المتخصصة من الأسفل.'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link 
                key={tool.id}
                href={`/${locale}/tools/teacher/${tool.slug}`}
                className="group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:border-primary hover:shadow-xl flex flex-col h-full"
            >
              <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl text-white mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3", tool.color)}>
                 <Icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tool.title[locale]}</h3>
              <p className="text-sm text-muted-foreground flex-grow leading-relaxed">{tool.description[locale]}</p>
              
              <div className="mt-6 flex items-center gap-2 text-xs font-black text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 uppercase tracking-tighter">
                {locale === 'en' ? 'Open Dashboard' : 'افتح لوحة التحكم'}
                <ArrowRight className={`h-3 w-3 ${locale === 'ar' ? 'rotate-180' : ''}`} />
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>
      
      {/* Featured AI Tip & Pedagogical Nudges */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Nudge Widget */}
        {expertInsights && expertInsights.length > 0 && (
           <div className="rounded-3xl bg-amber-50 border border-amber-100 p-8 flex items-start gap-4 animate-in zoom-in slide-in-from-right-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-amber-100">
                 <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg text-amber-900">
                        {locale === 'en' ? 'Pedagogical Expert Insight' : 'رؤية الخبير التربوي'}
                    </h4>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {locale === 'en' ? 'AI Coach' : 'مدرب ذكي'}
                    </span>
                 </div>
                 <p className="text-sm text-amber-800/80 leading-relaxed font-medium">
                    {expertInsights[0].message[locale]}
                 </p>
                 {expertInsights[0].actionLabel && (
                    <button 
                        onClick={() => navigateWithContext(expertInsights[0].actionToolSlug!, activeLessonData?.lesson.id || 0)}
                        className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    >
                        {expertInsights[0].actionLabel[locale]}
                        <ArrowRight className="w-3 h-3" />
                    </button>
                 )}
              </div>
           </div>
        )}

        {/* Standard Tip */}
        <div className="space-y-6">
            <DailyTip locale={locale} />
            <div className="rounded-3xl bg-gradient-to-r from-primary/10 to-transparent p-8 border border-primary/10 flex items-start gap-4 h-full">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-1">{locale === 'en' ? 'Pro Tip: Central Context' : 'نصيحة احترافية: السياق المركزي'}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {locale === 'en' 
                        ? "Upload your textbooks once in the 'Subject Store'. Our system automatically feeds the context to the Lesson Planner and Exam Engine for perfect alignment."
                        : "ارفع كتبك المدرسية مرة واحدة في 'مخزن المواد'. سيقوم نظامنا بتزويد مخطط الدروس ومولد الاختبارات بالسياق تلقائياً لضمان الدقة المطلقة."}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Recommended Tools Section (Affiliate Engine) */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {locale === 'en' ? 'Recommended for You' : 'مُوصى به لك'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
            <RecommendedToolCard 
                toolId="canva" 
                locale={locale} 
                context="teacher_dashboard"
            />
            <RecommendedToolCard 
                toolId="notion" 
                locale={locale} 
                context="teacher_dashboard"
                variant="full"
            />
        </div>
      </div>
    </div>
  );
}
