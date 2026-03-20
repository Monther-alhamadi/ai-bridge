"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Lightbulb,
  Lock,
  Route,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { db } from "@/lib/db";
import { useCurriculum } from "@/lib/hooks/use-curriculum-context";
import { useActiveLesson } from "@/lib/hooks/use-active-lesson";
import {
  getPreferredTeacherScenarioId,
  getTeacherWorkflowScenarios,
  type TeacherWorkflowScenario,
  type TeacherWorkflowStep,
  type TeacherWorkflowToolSlug,
} from "@/lib/teacher-workflows";
import { cn } from "@/lib/utils";

interface TeacherWorkflowNavigatorProps {
  locale: "en" | "ar";
  currentTool?: TeacherWorkflowToolSlug;
  variant?: "dashboard" | "compact";
}

function getStepIcon(slug: TeacherWorkflowToolSlug) {
  switch (slug) {
    case "subjects":
      return BookOpen;
    case "curriculum-architect":
      return CalendarDays;
    case "lesson-planner":
      return ClipboardList;
    case "exam-generator":
      return FileText;
    case "educational-consultant":
      return Lightbulb;
    default:
      return Sparkles;
  }
}

function getStatusCopy(
  locale: "en" | "ar",
  status: TeacherWorkflowStep["status"],
) {
  if (locale === "ar") {
    if (status === "complete") return "مكتملة";
    if (status === "current") return "الخطوة الحالية";
    if (status === "available") return "متاحة";
    return "تحتاج خطوة سابقة";
  }

  if (status === "complete") return "Complete";
  if (status === "current") return "Current";
  if (status === "available") return "Available";
  return "Locked";
}

function StepCard({
  locale,
  step,
  compact = false,
}: {
  locale: "en" | "ar";
  step: TeacherWorkflowStep;
  compact?: boolean;
}) {
  const Icon = getStepIcon(step.slug);

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-all",
        step.status === "complete" &&
          "border-emerald-200 bg-emerald-50/80 text-emerald-900",
        step.status === "current" &&
          "border-primary/30 bg-primary/5 shadow-sm shadow-primary/10",
        step.status === "available" &&
          "border-slate-200 bg-white/80 hover:border-primary/30",
        step.status === "locked" &&
          "border-dashed border-slate-200 bg-slate-50 text-slate-500",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            step.status === "complete" && "bg-emerald-500 text-white",
            step.status === "current" && "bg-primary text-white",
            step.status === "available" && "bg-slate-100 text-slate-700",
            step.status === "locked" && "bg-slate-100 text-slate-400",
          )}
        >
          {step.status === "complete" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : step.status === "locked" ? (
            <Lock className="h-5 w-5" />
          ) : (
            <Icon className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold">{step.title[locale]}</h4>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] uppercase tracking-wider",
                step.status === "complete" && "border-emerald-300 text-emerald-700",
                step.status === "current" && "border-primary/30 text-primary",
                step.status === "available" && "border-slate-300 text-slate-600",
                step.status === "locked" && "border-slate-200 text-slate-400",
              )}
            >
              {getStatusCopy(locale, step.status)}
            </Badge>
            {step.optional && (
              <Badge variant="secondary" className="text-[10px]">
                {locale === "ar" ? "اختيارية" : "Optional"}
              </Badge>
            )}
          </div>

          {!compact && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.description[locale]}
            </p>
          )}

          {step.status !== "locked" && (
            <Link
              href={step.href}
              className="inline-flex items-center gap-2 pt-1 text-xs font-bold text-primary"
            >
              {locale === "ar" ? "الانتقال لهذه الخطوة" : "Go to this step"}
              <ArrowRight className={cn("h-3 w-3", locale === "ar" && "rotate-180")} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function findScenarioForTool(
  scenarios: TeacherWorkflowScenario[],
  currentTool?: TeacherWorkflowToolSlug,
) {
  const preferredId = getPreferredTeacherScenarioId(currentTool);
  return (
    scenarios.find((scenario) => scenario.id === preferredId) || scenarios[0] || null
  );
}

export function TeacherWorkflowNavigator({
  locale,
  currentTool,
  variant = "dashboard",
}: TeacherWorkflowNavigatorProps) {
  const { textbooks, activeTextbookId } = useCurriculum();
  const activeLessonData = useActiveLesson();
  const allLessons = useLiveQuery(() => db.lessons.toArray(), []);

  const scopedLessons = (allLessons ?? []).filter((lesson) =>
    activeTextbookId ? lesson.textbookId === activeTextbookId : true,
  );
  const plannedLessonsCount = scopedLessons.filter(
    (lesson) => lesson.status === "planned" || lesson.status === "completed",
  ).length;
  const pendingLessonsCount = scopedLessons.filter(
    (lesson) => lesson.status === "pending",
  ).length;

  const scenarios = getTeacherWorkflowScenarios({
    locale,
    activeTextbookId,
    textbooksCount: textbooks?.length ?? 0,
    lessonsCount: scopedLessons.length,
    plannedLessonsCount,
    pendingLessonsCount,
    activeLessonId: activeLessonData?.lesson.id,
    activeLessonTitle: activeLessonData?.lesson.title,
    activeLessonIsPlanned: activeLessonData?.lesson.status === "planned",
  }, currentTool);

  if (!textbooks && !allLessons) {
    return null;
  }

  const focusedScenario = findScenarioForTool(scenarios, currentTool);

  if (!focusedScenario) {
    return null;
  }

  const currentIndex = currentTool
    ? focusedScenario.steps.findIndex((step) => step.slug === currentTool)
    : -1;
  const previousStep =
    currentIndex > 0 ? focusedScenario.steps[currentIndex - 1] : null;
  const nextStep =
    currentIndex >= 0
      ? focusedScenario.steps
          .slice(currentIndex + 1)
          .find((step) => step.status !== "locked") || null
      : focusedScenario.primaryAction;

  if (variant === "compact") {
    return (
      <section className="rounded-3xl border border-primary/10 bg-gradient-to-r from-primary/5 via-white to-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <Badge className="w-fit border-none bg-primary/10 text-primary">
              <Route className="mr-1 h-3 w-3" />
              {locale === "ar" ? "مسار العمل" : "Workflow"}
            </Badge>
            <div>
              <h3 className="text-xl font-black">{focusedScenario.title[locale]}</h3>
              <p className="max-w-2xl text-sm text-muted-foreground">
                {focusedScenario.description[locale]}
              </p>
            </div>
            {activeLessonData?.lesson.title && (
              <p className="text-xs font-bold text-primary/80">
                {locale === "ar"
                  ? `الدرس المرتبط الآن: ${activeLessonData.lesson.title}`
                  : `Current linked lesson: ${activeLessonData.lesson.title}`}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white/70 px-4 py-3 text-sm shadow-sm">
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
              {locale === "ar" ? "التقدم" : "Progress"}
            </span>
            <span className="text-lg font-black text-primary">
              {focusedScenario.progress.done}/{focusedScenario.progress.total}
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {focusedScenario.steps.map((step) => (
            <StepCard key={`${focusedScenario.id}-${step.slug}`} locale={locale} step={step} compact />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          {previousStep && previousStep.status !== "locked" && (
            <Link
              href={previousStep.href}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
            >
              {locale === "ar" ? "العودة للخطوة السابقة" : "Previous step"}
            </Link>
          )}
          {nextStep && nextStep.status !== "locked" && (
            <Link
              href={nextStep.href}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.01]"
            >
              {locale === "ar" ? "الانتقال للخطوة التالية" : "Continue to next step"}
              <ArrowRight className={cn("h-4 w-4", locale === "ar" && "rotate-180")} />
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <Badge className="w-fit border-none bg-primary/10 text-primary">
          <Route className="mr-1 h-3 w-3" />
          {locale === "ar" ? "سيناريوهات التنقل" : "Guided Scenarios"}
        </Badge>
        <h2 className="text-2xl font-black">
          {locale === "ar"
            ? "التنقل الذكي بين أدوات نظام المعلم"
            : "Smart navigation across Teacher OS"}
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {locale === "ar"
            ? "هذه السيناريوهات ترتب الأدوات حسب وضع المعلم الفعلي: إعداد أولي، حصة يومية، أو تجهيز اختبار. كل بطاقة تعرض الخطوة المنطقية التالية بدل ترك المستخدم يتنقل عشوائياً."
            : "These scenarios arrange the tools around the teacher's real state: first-time setup, daily teaching, or assessment prep. Each card exposes the logical next move instead of leaving navigation to guesswork."}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-lg font-black">{scenario.title[locale]}</h3>
                <p className="text-sm text-muted-foreground">
                  {scenario.description[locale]}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-3 py-2 text-center shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                  {locale === "ar" ? "التقدم" : "Progress"}
                </div>
                <div className="text-base font-black text-primary">
                  {scenario.progress.done}/{scenario.progress.total}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {scenario.steps.map((step) => (
                <StepCard
                  key={`${scenario.id}-${step.slug}`}
                  locale={locale}
                  step={step}
                />
              ))}
            </div>

            {scenario.primaryAction && (
              <Link
                href={scenario.primaryAction.href}
                className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary"
              >
                {locale === "ar" ? "افتح الخطوة الأنسب الآن" : "Open the best next step"}
                <ArrowRight className={cn("h-4 w-4", locale === "ar" && "rotate-180")} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
