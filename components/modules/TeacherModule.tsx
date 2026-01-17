"use client";

import { FileText, ClipboardList, PenTool, ArrowRight, Sparkles, Calendar } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { cn } from "@/lib/utils";
import { useActiveLesson } from "@/lib/hooks/use-active-lesson";
import { usePedagogicalCoach } from "@/lib/hooks/use-pedagogical-coach";
import { RecommendedToolCard } from "@/components/RecommendedToolCard";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ar as arLocale, enUS as enLocale } from "date-fns/locale";

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
  }
];

export function TeacherModule({ locale, profession, toolSlug }: TeacherModuleProps) {
  const activeLessonData = useActiveLesson();
  const expertInsights = usePedagogicalCoach();
  const router = useRouter();

  const navigateWithContext = (toolSlug: string, lessonId: number) => {
    router.push(`/${locale}/tools/teacher/${toolSlug}?lessonId=${lessonId}`);
  };

  return (
    <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-8">
      
      {/* Magic Active Lesson Widget */}
      {activeLessonData && (
        <div className="rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-blue-600 p-1 text-white shadow-2xl overflow-hidden relative">
           <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
           
           <div className="bg-white/10 backdrop-blur-sm rounded-[22px] p-6 sm:p-8 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-3 backdrop-blur-md">
                        {activeLessonData.type === 'today' 
                            ? (locale === 'ar' ? 'درس اليوم 🔴' : 'Live: Today\'s Lesson') 
                            : (locale === 'ar' ? 'القادم' : 'Up Next')}
                    </Badge>
                    <h2 className="text-3xl font-black mb-1">{activeLessonData.lesson.title}</h2>
                    <p className="text-blue-100 flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        {format(activeLessonData.lesson.date, 'EEEE, d MMMM', { locale: locale === 'ar' ? arLocale : enLocale })}
                    </p>
                 </div>

                 <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => navigateWithContext('lesson-planner', activeLessonData.lesson.id!)}
                        className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2"
                    >
                        <ClipboardList className="w-5 h-5" />
                        {locale === 'ar' ? 'تحضير الدرس' : 'Plan Lesson'}
                    </button>
                    <button 
                        onClick={() => navigateWithContext('exam-generator', activeLessonData.lesson.id!)}
                        className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition-all border border-white/30 hover:border-white/50 flex items-center gap-2"
                    >
                        <FileText className="w-5 h-5" />
                        {locale === 'ar' ? 'اختبار سريع' : 'Quick Quiz'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

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
        <div className="rounded-3xl bg-gradient-to-r from-primary/10 to-transparent p-8 border border-primary/10 flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
                <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h4 className="font-bold text-lg mb-1">{locale === 'en' ? 'Pro Tip: File Context' : 'نصيحة احترافية: سياق الملفات'}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {locale === 'en' 
                    ? "Upload your textbook PDFs within any tool. Our 'Universal Ingestion' automatically extracts key definitions and context to make the AI output 10x more accurate and relevant to your syllabus."
                    : "ارفع ملفات الـ PDF الخاصة بك داخل أي أداة. سيقوم 'نظام الاستيعاب الشامل' باستخراج التعريفات والسياق تلقائياً لجعل مخرجات الذكاء الاصطناعي أكثر دقة بمقدار 10 أضعاف ومناسبة لمنهجك الدراسي."}
                </p>
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
