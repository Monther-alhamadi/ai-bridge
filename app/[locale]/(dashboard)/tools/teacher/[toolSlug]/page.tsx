import { notFound } from "next/navigation";
import { professions } from "@/config/professions";
import type { Locale } from "@/config/i18n";
import { ExamEngine } from "@/components/modules/teacher/ExamEngine";
import { LessonPlanner } from "@/components/modules/teacher/LessonPlanner";
import { EducationalConsultant } from "@/components/modules/teacher/EducationalConsultant";
import { CurriculumArchitect } from "@/components/modules/teacher/CurriculumArchitect";
import { ModularParametricTool } from "@/components/ModularParametricTool";

// Component Registry for Teacher Tools
const TEACHER_TOOLS: Record<string, any> = {
  "exam-generator": ExamEngine,
  "lesson-planner": LessonPlanner,
  "educational-consultant": EducationalConsultant,
  "curriculum-architect": CurriculumArchitect,
  // Fallbacks
  "career-assistant": ModularParametricTool,
  "smart-consultant": ModularParametricTool,
};

interface ToolPageProps {
  params: {
    locale: Locale;
    toolSlug: string; // e.g., 'exam-generator'
  };
}

export default function TeacherToolPage({ params }: ToolPageProps) {
  const { locale, toolSlug } = params;
  
  // Verify profession context (Teacher)
  // In this route, we assume 'teacher' slug implicit
  const professionSlug = 'teacher';
  const profession = professions.find((p) => p.slug === professionSlug);

  if (!profession) notFound();

  // Find the Tool Component
  const ToolComponent = TEACHER_TOOLS[toolSlug];
  
  if (!ToolComponent) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-300">{locale === 'en' ? 'Under Construction' : 'قيد الإنشاء'}</h1>
        <p className="text-slate-500">{locale === 'en' ? 'This module is being forged in the fire.' : 'يتم صياغة هذه الوحدة حالياً.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <header className="mb-6 border-b border-slate-200 pb-6">
           <h1 className="text-2xl font-black text-slate-900 capitalize flex items-center gap-2">
                <span className="text-blue-600">/</span> {toolSlug.replace(/-/g, ' ')}
           </h1>
       </header>

       {/* Render Tool without Marketing wrappers */}
       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-1">
            <ToolComponent locale={locale} profession={professionSlug} toolSlug={toolSlug} />
       </div>
    </div>
  );
}
