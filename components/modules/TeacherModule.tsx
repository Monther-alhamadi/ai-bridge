"use client";

import { TeacherTaskHub } from "@/components/TeacherTaskHub";
import { ExamGenerator } from "@/components/ExamGenerator";

interface TeacherModuleProps {
  locale: "en" | "ar";
}

export function TeacherModule({ locale }: TeacherModuleProps) {
  return (
    <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8">
      {/* Task Hub */}
      <TeacherTaskHub locale={locale} />
      
      {/* Exam Engine (SaaS MVP) */}
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-transparent blur-xl -z-10 rounded-[3rem]" />
        <ExamGenerator locale={locale} />
      </div>
    </section>
  );
}
