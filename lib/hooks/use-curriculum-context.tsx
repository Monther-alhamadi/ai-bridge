"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Textbook, Lesson } from '@/lib/db';

interface CurriculumContextType {
  textbooks: Textbook[] | undefined;
  lessons: Lesson[] | undefined;
  activeTextbookId: number | null;
  setActiveTextbookId: (id: number | null) => void;
  isLoading: boolean;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined);

export function CurriculumProvider({ children, locale }: { children: ReactNode, locale: string }) {
  const [activeTextbookId, setActiveTextbookId] = React.useState<number | null>(null);

  const textbooks = useLiveQuery(() => db.textbooks.toArray());
  const lessons = useLiveQuery(
    () => activeTextbookId ? db.lessons.where('textbookId').equals(activeTextbookId).toArray() : Promise.resolve([] as Lesson[]),
    [activeTextbookId]
  );

  const isLoading = textbooks === undefined;

  // Persistence for active textbook
  React.useEffect(() => {
    const saved = localStorage.getItem('teacher-active-textbook');
    if (saved && !activeTextbookId) {
      setActiveTextbookId(parseInt(saved));
    }
  }, []);

  React.useEffect(() => {
    if (activeTextbookId) {
      localStorage.setItem('teacher-active-textbook', activeTextbookId.toString());
    }
  }, [activeTextbookId]);

  return (
    <CurriculumContext.Provider value={{ 
      textbooks, 
      lessons, 
      activeTextbookId, 
      setActiveTextbookId,
      isLoading 
    }}>
      {children}
    </CurriculumContext.Provider>
  );
}

export function useCurriculum() {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
}
