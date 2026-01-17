import { db } from '../db';
import { toast } from 'react-hot-toast';

export function useBackup() {

  const exportData = async () => {
    try {
      const textbooks = await db.textbooks.toArray();
      const lessons = await db.lessons.toArray();
      
      const backup = {
        timestamp: new Date().toISOString(),
        version: 1,
        data: {
          textbooks,
          lessons
        }
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `teacher-os-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error("Backup failed:", error);
      return false;
    }
  };

  const importData = async (file: File) => {
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      
      if (!backup.data || !backup.data.textbooks || !backup.data.lessons) {
        throw new Error("Invalid backup file format");
      }

      await db.transaction('rw', db.textbooks, db.lessons, async () => {
        await db.textbooks.clear();
        await db.lessons.clear();
        
        // We might need to sanitize dates back from strings if Dexie doesn't handle JSON parse auto
        // Dexie stores Dates as Date objects usually. JSON has strings.
        // Let's map them.
        
        const textbooks = backup.data.textbooks.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt)
        }));

        const lessons = backup.data.lessons.map((l: any) => ({
            ...l,
            date: new Date(l.date),
            createdAt: new Date(l.createdAt)
        }));

        await db.textbooks.bulkAdd(textbooks);
        await db.lessons.bulkAdd(lessons);
      });

      return true;
    } catch (error) {
       console.error("Import failed:", error);
       throw error;
    }
  };

  return { exportData, importData };
}
