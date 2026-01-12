"use client";

import { BookOpen, Presentation, Mail, GraduationCap, ArrowRight, Video, FileText } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface TeacherTaskHubProps {
  locale: "en" | "ar";
}

export function TeacherTaskHub({ locale }: TeacherTaskHubProps) {
  const tasks = [
    {
      icon: BookOpen,
      title: { en: "Plan a Lesson", ar: "تحضير درس" },
      desc: { en: "Create a 45-min lesson plan with objectives.", ar: "خطة درس كاملة مع الأهداف في دقائق." },
      action: { en: "Start Planning", ar: "ابدأ التحضير" },
      url: "https://www.curipod.com/", // Smart Router -> Curipod
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: Presentation,
      title: { en: "Design Slides", ar: "تصميم عرض" },
      desc: { en: "Turn text into a presentation instantly.", ar: "حول النص إلى عرض تقديمي فوراً." },
      action: { en: "Open Gamma", ar: "افتح Gamma" },
      url: "https://gamma.app/", // Smart Router -> Gamma
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      icon: GraduationCap,
      title: { en: "Create Quiz", ar: "إنشاء اختبار" },
      desc: { en: "Generate MCQs and export to Kahoot.", ar: "ولد أسئلة وصدرها لـ Kahoot." },
      action: { en: "Quiz Maker", ar: "صانع الاختبارات" },
      url: "#exam-engine", // Internal Anchor
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: Mail,
      title: { en: "Parent Email", ar: "رسالة لولي الأمر" },
      desc: { en: "Write professional updates regarding students.", ar: "اكتب رسائل متابعة احترافية." },
      action: { en: "Write Email", ar: "اكتب الرسالة" },
      url: "/go/chatgpt", // Smart Router -> ChatGPT
      color: "bg-amber-500/10 text-amber-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold md:text-3xl">
          {locale === "en" ? "Teacher Task Hub" : "مركز مهام المعلم"}
        </h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {locale === "en" ? "New" : "جديد"}
        </span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tasks.map((task, i) => (
          <Link 
            key={i} 
            href={task.url}
            target={task.url.startsWith("http") ? "_blank" : "_self"}
            onClick={() => trackEvent("affiliate_click", { item_name: task.title.en, context: "teacher_hub" })}
            className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
          >
            <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center ${task.color}`}>
              <task.icon className="h-6 w-6" />
            </div>
            
            <div className="space-y-2 mb-6">
              <h3 className="font-bold text-lg">{task.title[locale]}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.desc[locale]}
              </p>
            </div>

            <div className="flex items-center text-sm font-bold text-primary group-hover:underline">
              {task.action[locale]}
              <ArrowRight className={`h-4 w-4 mx-2 transition-transform group-hover:translate-x-1 ${locale ==="ar" && "rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0"}`} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
