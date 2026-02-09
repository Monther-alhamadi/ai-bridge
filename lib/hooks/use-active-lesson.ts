import { useLiveQuery } from 'dexie-react-hooks';
import { db, Lesson } from '../db';

export function useActiveLesson() {
  const activeLesson = useLiveQuery(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Find today's lesson
    // Note: In a real app, date comparison with IndexedDB ranges can be tricky.
    // We'll simplisticly fetch upcoming lessons and filter in JS for MVP.
    const savedTextbookId = localStorage.getItem('teacher-active-textbook');
    const textbookId = savedTextbookId ? parseInt(savedTextbookId) : null;

    if (!textbookId) return null;

    const textbook = await db.textbooks.get(textbookId);
    if (!textbook) return null;

    // 1. Fetch pending lessons for this subject
    const lessons = await db.lessons
        .where('textbookId')
        .equals(textbookId)
        .and(l => l.status === 'pending')
        .toArray();

    if (lessons.length === 0) return null;

    // Sort by date
    lessons.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Apply Curriculum Sync: Ignore lessons before currentLesson (if currentLesson = 10, start from 10th index)
    // Indexes are 0-based, so currentLesson 1 refers to Index 0.
    const syncOffset = (textbook.currentLesson || 1) - 1;
    const syncedLessons = lessons.slice(syncOffset > 0 ? syncOffset : 0);

    if (syncedLessons.length === 0) return null;

    const todayLesson = syncedLessons.find(l => {
        const d = new Date(l.date);
        d.setHours(0,0,0,0);
        return d.getTime() === today.getTime();
    });

    if (todayLesson) return { lesson: todayLesson, type: 'today' };

    // Fallback: Next upcoming from the synced list
    const nextLesson = syncedLessons.find(l => l.date > today);
    return nextLesson ? { lesson: nextLesson, type: 'next' } : null;

  });

  return activeLesson;
}
