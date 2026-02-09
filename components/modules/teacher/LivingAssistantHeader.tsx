"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coffee, Sun, Moon, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ar as arLocale, enUS as enLocale } from 'date-fns/locale';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface AssistantMessage {
    text: string;
    subtext?: string;
    icon: React.ReactNode;
    type: 'greeting' | 'action' | 'reminder' | 'encouragement';
}

export function LivingAssistantHeader({ locale }: { locale: 'en' | 'ar' }) {
    const [message, setMessage] = useState<AssistantMessage | null>(null);
    const isRTL = locale === 'ar';

    // Get basic stats for context
    const pendingLessonsCount = useLiveQuery(() => 
        db.lessons.where('status').equals('pending').count()
    );

    useEffect(() => {
        const generateLivingContext = () => {
            const now = new Date();
            const hour = now.getHours();
            const day = now.getDay(); // 0 = Sun, 4 = Thu
            
            let contextMsg: AssistantMessage = {
                text: locale === 'ar' ? "أهلاً بك زميلي المبدع" : "Welcome, creative colleague",
                icon: <Sparkles className="text-yellow-400" />,
                type: 'greeting'
            };

            // Time-based personality
            if (hour >= 5 && hour < 12) {
                contextMsg = {
                    text: locale === 'ar' ? "صباح النشاط والعطاء" : "Good morning, full of energy",
                    subtext: locale === 'ar' ? "قهوتك جاهزة؟ لنبدأ يومنا بتنظيم حصص اليوم." : "Got your coffee? Let's start by organizing today's lessons.",
                    icon: <Coffee className="text-amber-500" />,
                    type: 'greeting'
                };
            } else if (hour >= 12 && hour < 17) {
                contextMsg = {
                    text: locale === 'ar' ? "طاب مساؤك" : "Good afternoon",
                    subtext: locale === 'ar' ? "أتمنى أن حصصك كانت ممتعة اليوم. هل نحتاج لتجهيز شيء للغد؟" : "Hope your lessons were great today. Need to prepare for tomorrow?",
                    icon: <Sun className="text-orange-400" />,
                    type: 'greeting'
                };
            } else {
                contextMsg = {
                    text: locale === 'ar' ? "مساء الهدوء" : "Good evening",
                    subtext: locale === 'ar' ? "وقت الراحة.. هل أجهز لك مسودة دروس الأسبوع القادم؟" : "Time to rest.. Shall I prepare next week's lesson drafts for you?",
                    icon: <Moon className="text-indigo-400" />,
                    type: 'greeting'
                };
            }

            // Database-driven proactivity
            if (pendingLessonsCount && pendingLessonsCount > 0) {
                if (hour >= 15) { // Afternoon/Evening proactivity
                    contextMsg = {
                        text: locale === 'ar' ? "تنبيه ذكي: حصة الغد بانتظارك" : "Smart Alert: Tomorrow's lesson is waiting",
                        subtext: locale === 'ar' ? `لديك ${pendingLessonsCount} دروس قادمة تحتاج لتحضير. هل نبدأ بواحد الآن؟` : `You have ${pendingLessonsCount} upcoming lessons to plan. Shall we start one?`,
                        icon: <AlertCircle className="text-red-400" />,
                        type: 'reminder'
                    };
                }
            }

            // Special Day logic (Thursday)
            if (day === 4 && hour > 14) {
                contextMsg = {
                    text: locale === 'ar' ? "نهاية أسبوع سعيدة!" : "Happy Weekend!",
                    subtext: locale === 'ar' ? "لقد أبدعت هذا الأسبوع. ما رأيك أن ألخص لك إنجازاتك في تقرير سريع؟" : "You did great this week. Want me to summarize your achievements in a quick report?",
                    icon: <CheckCircle2 className="text-emerald-500" />,
                    type: 'encouragement'
                };
            }

            setMessage(contextMsg);
        };

        generateLivingContext();
    }, [pendingLessonsCount, locale]);

    if (!message) return null;

    return (
        <div className="mb-10" dir={isRTL ? 'rtl' : 'ltr'}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={message.text}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    className="flex flex-col gap-1"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                            {message.icon}
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
                            {message.text}
                        </h2>
                    </div>
                    {message.subtext && (
                        <motion.p 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            transition={{ delay: 0.2 }}
                            className="text-blue-100/60 font-medium text-lg max-w-2xl leading-relaxed mt-2 mr-11 ml-11"
                        >
                            {message.subtext}
                        </motion.p>
                    )}
                </motion.div>
            </AnimatePresence>
            
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100px' }}
                className="h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full mt-6 opacity-30"
            />
        </div>
    );
}
