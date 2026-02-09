"use client";

import React, { useMemo } from 'react';
import { useCurriculum } from '@/lib/hooks/use-curriculum-context';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ar as arLocale, enUS as enLocale } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, MoreHorizontal, Clock, Calendar as CalendarIcon, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

interface ScheduleWidgetProps {
    locale: 'en' | 'ar';
}

export function ScheduleWidget({ locale }: ScheduleWidgetProps) {
    const { textbooks, setActiveTextbookId } = useCurriculum();
    const router = useRouter();
    const isRTL = locale === 'ar';

    // Generate the "School Week" (Sun-Thu) relative to today
    const weekDays = useMemo(() => {
        const today = new Date();
        const day = today.getDay();
        const isWeekend = day === 5 || day === 6; // Fri or Sat
        
        // Start from Sunday
        const startDay = isWeekend 
            ? startOfWeek(addDays(today, 2), { weekStartsOn: 0 }) 
            : startOfWeek(today, { weekStartsOn: 0 });

        return Array.from({ length: 5 }).map((_, i) => {
            const date = addDays(startDay, i);
            return {
                date,
                dayId: i, // 0=Sun, 1=Mon, etc. matches our DB schema
                isToday: isSameDay(date, today)
            };
        });
    }, []);

    // Live Query for Lessons this week
    const weekDates = weekDays.map(d => d.date);
    const startOfView = weekDates[0];
    const endOfView = weekDates[weekDates.length - 1];

    const scheduledLessons = useLiveQuery(
        () => db.lessons
            .where('date')
            .between(startOfView, addDays(endOfView, 1))
            .toArray()
    , [startOfView, endOfView]);

    const weeklySchedule = useMemo(() => {
        return weekDays.map(day => {
            // Find lessons for this specific day
            const dayLessons = scheduledLessons?.filter(l => isSameDay(l.date, day.date)) || [];
            
            // Map lessons to their Textbooks
            const subjectsWithLessons = dayLessons.map(lesson => {
                const book = textbooks?.find(t => t.id === lesson.textbookId);
                return {
                    id: book?.id,
                    lessonId: lesson.id,
                    title: lesson.title,
                    subjectTitle: book?.title || 'Unknown',
                    currentLesson: lesson.title,
                    grade: book?.grade
                };
            });

            return {
                ...day,
                subjects: subjectsWithLessons
            };
        });
    }, [textbooks, weekDays, scheduledLessons]);


    return (
        <section className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    {locale === 'ar' ? 'رحلة الأسبوع' : 'Weekly Journey'}
                </h3>
                <div className="flex gap-2 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> {locale === 'ar' ? 'حصصي' : 'My Classes'}</span>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-3 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing snap-x">
                {weeklySchedule.map((day, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "min-w-[140px] rounded-3xl p-4 flex flex-col gap-3 border snap-start transition-all relative overflow-hidden group",
                            day.isToday 
                                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105 ring-2 ring-primary ring-offset-2" 
                                : "bg-card hover:bg-muted/50 border-transparent hover:border-border/50"
                        )}
                    >
                         {/* Header */}
                         <div className="flex items-baseline justify-between">
                            <span className={cn("text-sm font-bold opacity-80", day.isToday ? "text-primary-foreground" : "text-muted-foreground")}>
                                {format(day.date, 'EEE', { locale: locale === 'ar' ? arLocale : enLocale })}
                            </span>
                            <span className={cn("text-2xl font-black", day.isToday ? "text-white" : "text-foreground")}>
                                {format(day.date, 'd')}
                            </span>
                         </div>

                         {/* Subjects */}
                         <div className="space-y-2 mt-2">
                            {day.subjects.length > 0 ? (
                                day.subjects.map(sub => (
                                    <div
                                        key={sub.lessonId}
                                        className={cn(
                                            "w-full rounded-2xl flex flex-col transition-all overflow-hidden border",
                                            day.isToday 
                                                ? "bg-white/10 border-white/20 text-white" 
                                                : "bg-background border-border/50 text-foreground shadow-sm"
                                        )}
                                    >
                                        {/* Top Area: Subject (Inventory Link) */}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if(sub.id) {
                                                    setActiveTextbookId(sub.id);
                                                    router.push(`/${locale}/tools/teacher/subjects`);
                                                }
                                            }}
                                            className={cn(
                                                "w-full text-left px-3 py-2 flex items-center justify-between border-b transition-colors",
                                                day.isToday ? "border-white/10 hover:bg-white/10" : "border-slate-100 hover:bg-slate-50"
                                            )}
                                        >
                                            <span className={cn(
                                                "text-[9px] uppercase font-black tracking-wider truncate max-w-[80px]",
                                                day.isToday ? "text-white/60" : "text-slate-400"
                                            )}>
                                                {sub.subjectTitle}
                                            </span>
                                            <Settings2 
                                                className={cn(
                                                    "w-3 h-3 cursor-pointer hover:scale-110 transition-transform",
                                                    day.isToday ? "text-white/40 hover:text-white" : "text-slate-300 hover:text-primary"
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/${locale}/tools/teacher/curriculum-architect?bookId=${sub.id}`);
                                                }}
                                            />
                                        </button>

                                        {/* Bottom Area: Lesson (Preparation Link) */}
                                        <button
                                            onClick={() => {
                                                if(sub.lessonId) {
                                                    router.push(`/${locale}/tools/teacher/lesson-planner?lessonId=${sub.lessonId}`);
                                                }
                                            }}
                                            className={cn(
                                                "w-full text-left px-3 py-2.5 hover:bg-primary/5 transition-colors group/lesson",
                                                day.isToday ? "hover:bg-white/10" : ""
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={cn(
                                                    "text-xs font-black leading-tight line-clamp-2",
                                                    day.isToday ? "text-white" : "text-blue-600 group-hover:text-blue-700"
                                                )}>
                                                    {sub.title}
                                                </span>
                                                <ChevronRight className={cn(
                                                    "w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1",
                                                    isRTL && "rotate-180 -translate-x-1",
                                                    day.isToday ? "text-white" : "text-primary"
                                                )} />
                                            </div>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="h-16 flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl opacity-30">
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Off</span>
                                </div>
                            )}
                         </div>

                         {/* Today Decor */}
                         {day.isToday && (
                            <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                         )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
