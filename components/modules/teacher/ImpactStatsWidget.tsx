"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { Sparkles, Clock, BookOpen, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Stats {
    lessonsCount: number;
    timeSaved: number;
    subjectsCount: number;
}

export function ImpactStatsWidget({ locale }: { locale: 'en' | 'ar' }) {
    const [stats, setStats] = useState<Stats>({ lessonsCount: 0, timeSaved: 0, subjectsCount: 0 });
    const isRTL = locale === 'ar';

    useEffect(() => {
        const loadStats = async () => {
            const lessons = await db.lessons.count();
            const subjects = await db.textbooks.count();
            // Estimating 15 mins saved per lesson
            setStats({
                lessonsCount: lessons,
                subjectsCount: subjects,
                timeSaved: lessons * 15
            });
        };
        loadStats();
    }, []);

    const statCards = [
        {
            label: locale === 'ar' ? 'دروس تم تحضيرها' : 'Lessons Planned',
            value: stats.lessonsCount,
            icon: BookOpen,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: locale === 'ar' ? 'وقت توفر لك' : 'Time Saved',
            value: stats.timeSaved > 60 
                ? `${Math.floor(stats.timeSaved / 60)}${locale === 'ar' ? ' ساعة' : 'h'}` 
                : `${stats.timeSaved}${locale === 'ar' ? ' دقيقة' : 'm'}`,
            icon: Clock,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            label: locale === 'ar' ? 'مواد تعليمية' : 'Subjects Managed',
            value: stats.subjectsCount,
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        }
    ];

    if (stats.lessonsCount === 0 && stats.subjectsCount === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
            {statCards.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative p-5 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-2xl shrink-0 group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                                {stat.label}
                            </p>
                            <h4 className="text-xl font-black tracking-tight">
                                {stat.value}
                                {stat.icon === Clock && <span className="text-xs font-bold text-muted-foreground ml-1">✨</span>}
                            </h4>
                        </div>
                    </div>
                    {/* Decorative Sparkle */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="text-primary/20 w-3 h-3" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
