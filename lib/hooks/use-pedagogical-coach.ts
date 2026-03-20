import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

export interface Insight {
  type:
    | "quiz_recommendation"
    | "review_needed"
    | "praise"
    | "monthly_test"
    | "midterm_test"
    | "final_test"
    | "sync_progress";
  message: { en: string; ar: string };
  actionLabel?: { en: string; ar: string };
  actionToolSlug?: string;
  relevanceScore: number;
}

export function usePedagogicalCoach() {
  const insights = useLiveQuery(async () => {
    const allLessons = await db.lessons.toArray();
    const textbooks = await db.textbooks.toArray();

    allLessons.sort((a, b) => a.date.getTime() - b.date.getTime());

    const activeInsights: Insight[] = [];
    const today = new Date();

    // 1. Quiz Gaps (Ebbinghaus)
    let lessonsSinceLastQuiz = 0;
    for (let i = allLessons.length - 1; i >= 0; i--) {
      const l = allLessons[i];
      if (
        l.title.toLowerCase().includes("quiz") ||
        l.title.toLowerCase().includes("exam")
      )
        break;
      lessonsSinceLastQuiz++;
    }
    if (lessonsSinceLastQuiz >= 4) {
      activeInsights.push({
        type: "quiz_recommendation",
        message: {
          en: `Time for quiz after ${lessonsSinceLastQuiz} lessons!`,
          ar: `اختبار بعد ${lessonsSinceLastQuiz} درس!`,
        },
        actionLabel: { en: "Quick Quiz", ar: "اختبار سريع" },
        actionToolSlug: "exam-generator",
        relevanceScore: 95,
      });
    }

    // 2. Auto-Test Markers (Monthly/Midterm/Final)
    const lessonsThisMonth = allLessons.filter((l) => {
      const lessonDate = new Date(l.date);
      return (
        lessonDate.getMonth() === today.getMonth() &&
        lessonDate.getFullYear() === today.getFullYear()
      );
    });
    if (lessonsThisMonth.length >= 20) {
      // Monthly test
      activeInsights.push({
        type: "monthly_test" as any,
        message: {
          en: "20+ lessons this month. Time for monthly assessment?",
          ar: "20+ درس هذا الشهر. اختبار شهري؟",
        },
        actionLabel: { en: "Monthly Test", ar: "اختبار شهري" },
        actionToolSlug: "exam-generator",
        relevanceScore: 90,
      });
    }
    // Midterm (~day 60)
    const firstLessonDate = allLessons[0]?.date
      ? new Date(allLessons[0].date)
      : today;
    const totalDays = Math.floor(
      (today.getTime() - firstLessonDate.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (totalDays > 55 && totalDays < 65) {
      activeInsights.push({
        type: "midterm_test" as any,
        message: {
          en: "Mid-semester! Prepare midterm exam.",
          ar: "نصف الفصل! اختبار نصفي.",
        },
        actionLabel: { en: "Midterm Exam", ar: "اختبار نصفي" },
        actionToolSlug: "exam-generator",
        relevanceScore: 98,
      });
    }

    // 3. Review Week-End
    if (today.getDay() === 4 || today.getDay() === 5) {
      const thisWeekLessons = allLessons.filter(
        (l) =>
          Math.abs(l.date.getTime() - today.getTime()) <
          7 * 24 * 60 * 60 * 1000,
      );
      const hasReview = thisWeekLessons.some((l) => l.title.includes("Review"));
      if (!hasReview) {
        activeInsights.push({
          type: "review_needed",
          message: {
            en: "End of week review recommended.",
            ar: "مراجعة نهاية الأسبوع.",
          },
          actionLabel: { en: "Plan Review", ar: "مراجعة" },
          actionToolSlug: "lesson-planner",
          relevanceScore: 85,
        });
      }
    }

    // 4. Progress Sync Reminder
    const pendingLessons = allLessons.filter(
      (l) => l.status === "pending" && l.date < today,
    );
    if (pendingLessons.length >= 3) {
      activeInsights.push({
        type: "sync_progress" as any,
        message: {
          en: "3+ overdue lessons. Update your progress?",
          ar: "3+ دروس متأخرة. حدث التقدم؟",
        },
        actionLabel: { en: "Sync Progress", ar: "مزامنة التقدم" },
        actionToolSlug: "curriculum-architect",
        relevanceScore: 92,
      });
    }

    return activeInsights
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 4);
  });

  return insights || [];
}
