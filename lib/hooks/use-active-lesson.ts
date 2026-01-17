import { useLiveQuery } from 'dexie-react-hooks';
import { db, Lesson } from '../db';

export function useActiveLesson() {
  const activeLesson = useLiveQuery(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Find today's lesson
    // Note: In a real app, date comparison with IndexedDB ranges can be tricky.
    // We'll simplisticly fetch upcoming lessons and filter in JS for MVP.
    const allPending = await db.lessons
        .where('status')
        .equals('pending')
        .toArray();

    // Sort by date
    allPending.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Find first one that is today or in future
    // Actually, for "Today's Lesson", we want specifically today.
    // If none today, maybe show the "Next Up".
    
    const todayLesson = allPending.find(l => {
        const d = new Date(l.date);
        d.setHours(0,0,0,0);
        return d.getTime() === today.getTime();
    });

    if (todayLesson) return { lesson: todayLesson, type: 'today' };

    // Fallback: Next upcoming
    const nextLesson = allPending.find(l => l.date > today);
    return nextLesson ? { lesson: nextLesson, type: 'next' } : null;

  });

  return activeLesson;
}
