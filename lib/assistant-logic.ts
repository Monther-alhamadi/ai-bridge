/**
 * Assistant Intelligence Engine (Phase 48)
 * Rules-based engine for proactive teaching support.
 */

import { db, Lesson } from './db';

export interface ProactiveSuggestion {
    id: string;
    title: { ar: string; en: string };
    description: { ar: string; en: string };
    actionLabel: { ar: string; en: string };
    actionUrl: string;
    type: 'warning' | 'tip' | 'success' | 'magic';
}

export const AssistantLogic = {
    /**
     * Generates active suggestions based on DB state and Time
     */
    getSuggestions: async (locale: 'en' | 'ar'): Promise<ProactiveSuggestion[]> => {
        const suggestions: ProactiveSuggestion[] = [];
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();

        // Rule 1: Tomorrow's Preparation Check
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0,0,0,0);
        
        const tomorrowLessons = await db.lessons
            .where('date')
            .equals(tomorrow)
            .filter(l => l.status === 'pending')
            .toArray();

        if (tomorrowLessons.length > 0 && hour >= 16) {
            suggestions.push({
                id: 'prep-tomorrow',
                title: { ar: 'تجهيز الغد', en: 'Tomorrow\'s Prep' },
                description: { 
                    ar: `لديك ${tomorrowLessons.length} دروس للغد لم يتم تحضيرها بعد. هل أجهز لك المسودات؟`, 
                    en: `You have ${tomorrowLessons.length} lessons for tomorrow not planned yet. Shall I draft them?` 
                },
                actionLabel: { ar: 'تحضير سحري ✨', en: 'Magic Prep ✨' },
                actionUrl: `/tools/teacher/lesson-planner?lessonId=${tomorrowLessons[0].id}&auto=true`,
                type: 'magic'
            });
        }

        // Rule 2: End of Week Report (Thursday afternoon)
        if (day === 4 && hour >= 13) {
            const weeklyLessons = await db.lessons.count(); // Simplified for MVP
            if (weeklyLessons > 0) {
                suggestions.push({
                    id: 'weekly-report',
                    title: { ar: 'تقرير الإنجاز الأسبوعي', en: 'Weekly Achievement' },
                    description: { 
                        ar: 'لقد أتممت أسبوعاً حافلاً! هل نلخص إنجازاتك في تقرير مهني؟', 
                        en: 'You had a busy week! Want to summarize your wins in a pro report?' 
                    },
                    actionLabel: { ar: 'توليد التقرير', en: 'Generate Report' },
                    actionUrl: '/tools/teacher/reports',
                    type: 'success'
                });
            }
        }

        // Rule 3: Subject Store Empty Check
        const subjectsCount = await db.textbooks.count();
        if (subjectsCount === 0) {
            suggestions.push({
                id: 'add-subject',
                title: { ar: 'لنبدأ الرحلة', en: 'Start the Journey' },
                description: { 
                    ar: 'ابدأ بإضافة مادتك الدراسية الأولى لنقوم بتنظيم جدولك آلياً.', 
                    en: 'Add your first subject so I can organize your schedule automatically.' 
                },
                actionLabel: { ar: 'إضافة مادة', en: 'Add Subject' },
                actionUrl: '/tools/teacher/subjects',
                type: 'tip'
            });
        }

        return suggestions;
    }
};
