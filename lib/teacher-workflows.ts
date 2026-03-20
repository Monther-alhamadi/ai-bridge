import type { Locale } from "@/config/i18n";

export type TeacherWorkflowToolSlug =
  | "subjects"
  | "curriculum-architect"
  | "lesson-planner"
  | "exam-generator"
  | "educational-consultant";

export interface TeacherWorkflowSnapshot {
  locale: Locale;
  activeTextbookId: number | null;
  textbooksCount: number;
  lessonsCount: number;
  plannedLessonsCount: number;
  pendingLessonsCount: number;
  activeLessonId?: number;
  activeLessonTitle?: string;
  activeLessonIsPlanned?: boolean;
}

export interface TeacherWorkflowStep {
  slug: TeacherWorkflowToolSlug;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  href: string;
  status: "complete" | "current" | "available" | "locked";
  optional?: boolean;
}

export interface TeacherWorkflowScenario {
  id: "setup" | "daily" | "assessment";
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  steps: TeacherWorkflowStep[];
  progress: {
    done: number;
    total: number;
  };
  primaryAction: TeacherWorkflowStep | null;
}

type RawStep = Omit<TeacherWorkflowStep, "status"> & {
  complete: boolean;
  available: boolean;
};

const TOOL_COPY: Record<
  TeacherWorkflowToolSlug,
  {
    title: Record<Locale, string>;
    description: Record<Locale, string>;
  }
> = {
  subjects: {
    title: { en: "Subject Store", ar: "مخزن المواد" },
    description: {
      en: "Add a subject, define grade, and activate your working context.",
      ar: "أضف المادة وحدد الصف وفعّل سياق العمل الأساسي.",
    },
  },
  "curriculum-architect": {
    title: { en: "Curriculum Architect", ar: "مهندس المنهج" },
    description: {
      en: "Turn the subject into a real teaching timeline and lesson schedule.",
      ar: "حوّل المادة إلى تسلسل زمني فعلي وجدول دروس قابل للتنفيذ.",
    },
  },
  "lesson-planner": {
    title: { en: "Lesson Planner", ar: "مخطط الدروس" },
    description: {
      en: "Prepare the upcoming lesson using the synced textbook context.",
      ar: "حضّر الدرس القادم باستخدام سياق الكتاب المتزامن.",
    },
  },
  "exam-generator": {
    title: { en: "Exam Generator", ar: "مولد الاختبارات" },
    description: {
      en: "Build assessments from the lessons you already prepared.",
      ar: "أنشئ الاختبارات انطلاقًا من الدروس التي تم تجهيزها.",
    },
  },
  "educational-consultant": {
    title: { en: "Educational Consultant", ar: "المستشار التربوي" },
    description: {
      en: "Use it when you need a classroom intervention or parent communication.",
      ar: "استخدمه عند الحاجة إلى معالجة صفية أو تواصل مع أولياء الأمور.",
    },
  },
};

function buildToolHref(
  locale: Locale,
  slug: TeacherWorkflowToolSlug,
  snapshot: TeacherWorkflowSnapshot,
) {
  const base =
    slug === "subjects"
      ? `/${locale}/tools/teacher/subjects`
      : `/${locale}/tools/teacher/${slug}`;

  if (slug === "curriculum-architect" && snapshot.activeTextbookId) {
    return `${base}?bookId=${snapshot.activeTextbookId}`;
  }

  if (
    (slug === "lesson-planner" || slug === "exam-generator") &&
    snapshot.activeLessonId
  ) {
    return `${base}?lessonId=${snapshot.activeLessonId}`;
  }

  return base;
}

function createStep(
  locale: Locale,
  slug: TeacherWorkflowToolSlug,
  snapshot: TeacherWorkflowSnapshot,
  options: {
    complete: boolean;
    available: boolean;
    optional?: boolean;
  },
): RawStep {
  return {
    slug,
    title: TOOL_COPY[slug].title,
    description: TOOL_COPY[slug].description,
    href: buildToolHref(locale, slug, snapshot),
    complete: options.complete,
    available: options.available,
    optional: options.optional,
  };
}

function materializeScenario(
  locale: Locale,
  scenario: Omit<TeacherWorkflowScenario, "steps" | "progress" | "primaryAction"> & {
    steps: RawStep[];
  },
  currentTool?: TeacherWorkflowToolSlug,
): TeacherWorkflowScenario {
  const requiredSteps = scenario.steps.filter((step) => !step.optional);
  const done = requiredSteps.filter((step) => step.complete).length;
  const total = requiredSteps.length;

  const firstActionableIndex = scenario.steps.findIndex(
    (step) => !step.complete && step.available,
  );

  const steps: TeacherWorkflowStep[] = scenario.steps.map((step, index) => {
    const isCurrent = currentTool === step.slug;

    let status: TeacherWorkflowStep["status"] = "locked";

    if (step.complete) {
      status = "complete";
    } else if (isCurrent) {
      status = "current";
    } else if (step.available && index === firstActionableIndex) {
      status = "current";
    } else if (step.available) {
      status = "available";
    }

    return {
      slug: step.slug,
      title: step.title,
      description: step.description,
      href: step.href,
      status,
      optional: step.optional,
    };
  });

  const primaryAction =
    steps.find((step) => step.status === "current") ||
    steps.find((step) => step.status === "available") ||
    null;

  return {
    id: scenario.id,
    title: scenario.title,
    description: scenario.description,
    steps,
    progress: { done, total },
    primaryAction,
  };
}

export function getTeacherWorkflowScenarios(
  snapshot: TeacherWorkflowSnapshot,
  currentTool?: TeacherWorkflowToolSlug,
) {
  const { locale } = snapshot;

  const hasSubjects = snapshot.textbooksCount > 0;
  const hasSchedule = snapshot.lessonsCount > 0;
  const hasPreparedLessons = snapshot.plannedLessonsCount > 0;
  const hasActiveLesson = Boolean(snapshot.activeLessonId);
  const activeLessonPrepared = Boolean(snapshot.activeLessonIsPlanned);

  return [
    materializeScenario(
      locale,
      {
        id: "setup",
        title: { en: "First-Time Setup", ar: "تهيئة البداية" },
        description: {
          en: "The clean sequence that turns a blank workspace into a usable teacher system.",
          ar: "التسلسل الأساسي الذي يحول المساحة الفارغة إلى نظام معلم جاهز للاستخدام.",
        },
        steps: [
          createStep(locale, "subjects", snapshot, {
            complete: hasSubjects,
            available: true,
          }),
          createStep(locale, "curriculum-architect", snapshot, {
            complete: hasSchedule,
            available: hasSubjects,
          }),
          createStep(locale, "lesson-planner", snapshot, {
            complete: hasPreparedLessons,
            available: hasSchedule,
          }),
          createStep(locale, "exam-generator", snapshot, {
            complete: false,
            available: hasPreparedLessons,
            optional: true,
          }),
        ],
      },
      currentTool,
    ),
    materializeScenario(
      locale,
      {
        id: "daily",
        title: { en: "Daily Teaching Flow", ar: "مسار الحصة اليومية" },
        description: {
          en: "Use this when you already have a schedule and want the fastest path to today's class.",
          ar: "استخدم هذا المسار عندما يكون الجدول جاهزًا وتريد أسرع طريق إلى حصة اليوم.",
        },
        steps: [
          createStep(locale, "subjects", snapshot, {
            complete: hasSubjects,
            available: true,
          }),
          createStep(locale, "curriculum-architect", snapshot, {
            complete: hasSchedule,
            available: hasSubjects,
          }),
          createStep(locale, "lesson-planner", snapshot, {
            complete: activeLessonPrepared,
            available: hasActiveLesson || hasSchedule,
          }),
          createStep(locale, "educational-consultant", snapshot, {
            complete: false,
            available: activeLessonPrepared || hasPreparedLessons,
            optional: true,
          }),
          createStep(locale, "exam-generator", snapshot, {
            complete: false,
            available: activeLessonPrepared || hasPreparedLessons,
            optional: true,
          }),
        ],
      },
      currentTool,
    ),
    materializeScenario(
      locale,
      {
        id: "assessment",
        title: { en: "Assessment Preparation", ar: "مسار إعداد الاختبار" },
        description: {
          en: "Follow this path when the goal is to assemble an exam from your actual taught lessons.",
          ar: "اتبع هذا المسار عندما يكون الهدف بناء اختبار من الدروس التي تم تدريسها فعليًا.",
        },
        steps: [
          createStep(locale, "subjects", snapshot, {
            complete: hasSubjects,
            available: true,
          }),
          createStep(locale, "curriculum-architect", snapshot, {
            complete: hasSchedule,
            available: hasSubjects,
          }),
          createStep(locale, "lesson-planner", snapshot, {
            complete: hasPreparedLessons,
            available: hasSchedule,
          }),
          createStep(locale, "exam-generator", snapshot, {
            complete: false,
            available: hasPreparedLessons || snapshot.pendingLessonsCount > 0,
          }),
        ],
      },
      currentTool,
    ),
  ];
}

export function getPreferredTeacherScenarioId(
  currentTool?: TeacherWorkflowToolSlug,
) {
  switch (currentTool) {
    case "subjects":
    case "curriculum-architect":
      return "setup";
    case "lesson-planner":
    case "educational-consultant":
      return "daily";
    case "exam-generator":
      return "assessment";
    default:
      return "setup";
  }
}
