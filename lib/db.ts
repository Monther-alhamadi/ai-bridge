import Dexie, { type Table } from "dexie";

// Type Aliases for backward/forward compatibility
export type Subject = Textbook;
export type LessonPlan = Lesson;

export interface Textbook {
  id?: number;
  title: string;
  subject?: string;
  grade?: string;
  bookFile?: File | Blob;
  bookName?: string;
  schedule?: number[]; // [0-6] for days of week (Sunday=0, Monday=1, etc.)
  lessonsPerDay?: number;
  semesterStart?: string; // ISO Date
  semesterEnd?: string; // ISO Date
  color?: string;
  fullText?: string;
  indexSummary?: string;
  chapters?: any[];
  updatedAt?: Date;
  createdAt?: Date;
  currentLesson?: number; // Phase 31: Curriculum Sync
  contentLanguage?: "en" | "ar"; // Detected language of the uploaded textbook
}

export interface Lesson {
  id?: number;
  textbookId: number;
  date: Date; // Keep as Date object for easier sorting in hooks
  title: string;
  objectives?: string[]; // New
  contentContext?: string; // Existing
  status: "planned" | "completed" | "skipped" | "pending";
  weekNumber?: number;
  createdAt?: Date;
}

export interface NewsItem {
  id?: number;
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  source: string;
  source_link: string;
  date: string;
  tag: string;
  score: number;
  intent: "education" | "coding" | "general";
  read: boolean;
  createdAt: Date;
}

export interface UserSettings {
  id?: number;
  key: string;
  value: any;
}

export class TeacherOSDatabase extends Dexie {
  textbooks!: Table<Textbook>;
  lessons!: Table<Lesson>;
  settings!: Table<UserSettings>;
  news!: Table<NewsItem>;

  constructor() {
    super("TeacherOSDB");
    this.version(3).stores({
      textbooks: "++id, title, grade",
      lessons: "++id, textbookId, date, status",
      settings: "++id, key",
      news: "++id, source_link, date",
    });
  }
}

export const db = new TeacherOSDatabase();
