import Dexie, { Table } from 'dexie';

// Define types for our database tables
export interface Textbook {
  id?: number;
  title: string;
  author?: string;
  grade?: string;
  subject?: string;
  fullText: string; // The entire OCR extracted text
  chapters: Chapter[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string; // UUID or simple index
  title: string;
  content: string;
  pageStart: number;
  pageEnd: number;
}

export interface Lesson {
  id?: number;
  textbookId?: number;
  title: string;
  date: Date;
  status: 'pending' | 'completed' | 'skipped';
  weekNumber: number;
  contentContext: string; // Extracted text segment relevant to this lesson
  generatedPlan?: any; // JSON bloob of the lesson plan
  createdAt: Date;
}

export class TeacherDatabase extends Dexie {
  textbooks!: Table<Textbook>;
  lessons!: Table<Lesson>;

  constructor() {
    super('TeacherOS_DB');
    
    // Define schema
    this.version(1).stores({
      textbooks: '++id, title, subject, grade', // Primary key and indexed props
      lessons: '++id, textbookId, date, status, weekNumber'
    });
  }
}

export const db = new TeacherDatabase();
