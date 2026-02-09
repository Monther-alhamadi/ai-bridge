"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Zap, Book, Lightbulb } from 'lucide-react';

interface MagicLoaderProps {
    locale: 'en' | 'ar';
    context?: 'lesson' | 'exam' | 'activity' | 'general';
}

const INSPIRATION_MESSAGES = {
    lesson: {
        ar: [
            "جسور يحلل محتوى الكتاب لاستخراج أفضل الأفكار...",
            "نحن نصمم درساً يحفز عقول طلابك...",
            "نطبق نموذج التعلم الخماسي (5E) لضمان الفعالية...",
            "نضيف لمسات من نظرية التعلم البنائي...",
            "نكاد ننتهي! نصقل اللمسات الأخيرة..."
        ],
        en: [
            "Josoor is analyzing the textbook to extract the best ideas...",
            "We're designing a lesson that inspires young minds...",
            "Applying the 5E learning model for maximum effectiveness...",
            "Adding touches from constructivist learning theory...",
            "Almost there! Polishing the final details..."
        ]
    },
    exam: {
        ar: [
            "نصمم أسئلة تقيس الفهم العميق...",
            "نطبق تصنيف بلوم لتنويع مستويات التفكير...",
            "نتأكد من توازن الصعوبة والعدالة...",
            "نضيف معايير تصحيح واضحة..."
        ],
        en: [
            "Crafting questions that measure deep understanding...",
            "Applying Bloom's Taxonomy for varied cognitive levels...",
            "Ensuring balanced difficulty and fairness...",
            "Adding clear grading criteria..."
        ]
    },
    general: {
        ar: [
            "الذكاء الاصطناعي يعمل من أجلك...",
            "نحلل ونبني ونصمم...",
            "جسور في خدمتك دائماً..."
        ],
        en: [
            "AI is working for you...",
            "Analyzing, building, designing...",
            "Josoor is always at your service..."
        ]
    }
};

export function MagicLoader({ locale, context = 'general' }: MagicLoaderProps) {
    const [messageIndex, setMessageIndex] = useState(0);
    const contextMessages = (INSPIRATION_MESSAGES[context as keyof typeof INSPIRATION_MESSAGES] || INSPIRATION_MESSAGES.general);
    const messages = contextMessages[locale];
    const isRTL = locale === 'ar';

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 px-6">
                {/* Animated Icon Stack */}
                <div className="relative w-32 h-32">
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 opacity-20 blur-xl" />
                    </motion.div>
                    
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 p-0.5 shadow-2xl shadow-primary/20">
                            <div className="w-full h-full rounded-[0.9rem] bg-slate-900 flex items-center justify-center">
                                <Brain className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Orbiting Icons */}
                    {[Sparkles, Lightbulb, Book, Zap].map((Icon, idx) => (
                        <motion.div
                            key={idx}
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{ 
                                duration: 6, 
                                repeat: Infinity, 
                                ease: "linear",
                                delay: idx * 0.5
                            }}
                        >
                            <div 
                                className="absolute w-6 h-6 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: `translate(-50%, -50%) translateY(-50px)`
                                }}
                            >
                                <Icon className="w-3 h-3 text-blue-400" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="w-64 h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Message Display */}
                <div className="text-center space-y-2 min-h-[80px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={messageIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-blue-100 text-lg font-bold leading-relaxed px-8 max-w-lg"
                        >
                            {messages[messageIndex]}
                        </motion.p>
                    </AnimatePresence>
                    <p className="text-slate-500 text-sm font-medium">
                        {locale === 'ar' ? 'لحظات قليلة فقط...' : 'Just a few moments...'}
                    </p>
                </div>
            </div>
        </div>
    );
}
