"use client";

import { FileText, ClipboardList, PenTool, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { cn } from "@/lib/utils";

interface TeacherModuleProps {
  locale: "en" | "ar";
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
  }
];

export function TeacherModule({ locale }: TeacherModuleProps) {
  return (
    <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-8">
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
      
      {/* Featured AI Tip */}
      <div className="rounded-3xl bg-gradient-to-r from-primary/10 to-transparent p-8 border border-primary/10 flex items-start gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
            <h4 className="font-bold text-lg mb-1">{locale === 'en' ? 'Pro Tip: File Context' : 'نصيحة احترافية: سياق الملفات'}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
                {locale === 'en' 
                  ? "Upload your textbook PDFs within any tool. Our 'Prompt Factory' automatically extracts key definitions and context to make the AI output 10x more accurate and relevant to your syllabus."
                  : "ارفع ملفات الـ PDF الخاصة بك داخل أي أداة. سيقوم 'مصنع البرومبتات' الخاص بنا باستخراج التعريفات والسياق تلقائياً لجعل مخرجات الذكاء الاصطناعي أكثر دقة بمقدار 10 أضعاف ومناسبة لمنهجك الدراسي."}
            </p>
        </div>
      </div>
    </div>
  );
}
