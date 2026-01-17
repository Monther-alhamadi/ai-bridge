import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export interface Insight {
  type: 'quiz_recommendation' | 'review_needed' | 'praise';
  message: { en: string; ar: string };
  actionLabel?: { en: string; ar: string };
  actionToolSlug?: string;
  relevanceScore: number;
}

export function usePedagogicalCoach() {
  const insights = useLiveQuery(async () => {
    const allLessons = await db.lessons.toArray();
    
    // Sort logic
    allLessons.sort((a, b) => a.date.getTime() - b.date.getTime());

    const activeInsights: Insight[] = [];
    
    // 1. Check for Quiz Gaps (Ebbinghaus Forgetting Curve)
    // Simple logic: If > 3 lessons passed since last "Quiz" or "Exam"
    let lessonsSinceLastQuiz = 0;
    
    // In a real app, we'd check checking lesson type. 
    // For MVP, we'll check if title contains "Quiz" or "Exam"
    for (let i = allLessons.length - 1; i >= 0; i--) {
        const l = allLessons[i];
        if (l.title.toLowerCase().includes('quiz') || l.title.toLowerCase().includes('exam')) {
            break;
        }
        lessonsSinceLastQuiz++;
    }

    if (lessonsSinceLastQuiz >= 4) {
        activeInsights.push({
            type: 'quiz_recommendation',
            message: {
                en: `It's been ${lessonsSinceLastQuiz} lessons since the last assessment. The forgetting curve suggests a quick quiz now to reinforce retention.`,
                ar: `لقد مرت ${lessonsSinceLastQuiz} دروس منذ آخر تقييم. يقترح منحنى النسيان إجراء اختبار سريع الآن لتعزيز الحفظ.`
            },
            actionLabel: { en: "Generate Quick Quiz", ar: "إنشاء اختبار سريع" },
            actionToolSlug: "exam-generator",
            relevanceScore: 90
        });
    }

    // 2. Check for Review (End of Week)
    // If today is Friday/Thursday and no review planned
    const today = new Date();
    if (today.getDay() === 4 || today.getDay() === 5) { // Thursday or Friday
       const thisWeekLessons = allLessons.filter(l => {
          const d = new Date(l.date);
          // simplistic week check
          return Math.abs(d.getTime() - today.getTime()) < 7 * 24 * 60 * 60 * 1000;
       });
       
       const hasReview = thisWeekLessons.some(l => l.title.includes('Review') || l.title.includes('مراجعة'));
       if (!hasReview) {
            activeInsights.push({
                type: 'review_needed',
                message: {
                    en: "End of week detected. Consider scheduling a short review session to consolidate this week's topics.",
                    ar: "نهاية الأسبوع اقتربت. فكر في جدولة جلسة مراجعة قصيرة لتوحيد مواضيع هذا الأسبوع."
                },
                actionLabel: { en: "Plan Review Session", ar: "تخطيط جلسة مراجعة" },
                actionToolSlug: "lesson-planner",
                relevanceScore: 80
            });
       }
    }

    return activeInsights.sort((a, b) => b.relevanceScore - a.relevanceScore);
  });

  return insights;
}
