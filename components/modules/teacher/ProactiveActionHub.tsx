"use client";

import React, { useEffect, useState } from 'react';
import { AssistantLogic, ProactiveSuggestion } from '@/lib/assistant-logic';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, Info, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function ProactiveActionHub({ locale }: { locale: 'en' | 'ar' }) {
    const [suggestions, setSuggestions] = useState<ProactiveSuggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSuggestions = async () => {
            setLoading(true);
            const data = await AssistantLogic.getSuggestions(locale);
            setSuggestions(data);
            setLoading(false);
        };
        fetchSuggestions();
    }, [locale]);

    if (loading) return (
        <div className="flex items-center gap-2 text-slate-400 text-xs mt-4">
            <Loader2 className="w-3 h-3 animate-spin" />
            {locale === 'ar' ? 'جاري تحليل الحالة الدراسية...' : 'Analyzing teaching context...'}
        </div>
    );

    if (suggestions.length === 0) return null;

    return (
        <div className="space-y-4 mt-8 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Zap size={10} className="text-yellow-500 fill-yellow-500" />
                    {locale === 'ar' ? 'اقتراحات جسور الذكية' : 'Josoor Smart Suggestions'}
                </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {suggestions.map((suggestion) => (
                        <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-4 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/40 hover:border-primary/30 transition-all flex flex-col justify-between group"
                        >
                            <div className="flex gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0 group-hover:scale-110 transition-transform">
                                    {suggestion.type === 'magic' ? <Zap size={18} /> : (suggestion.type === 'success' ? <Award size={18} /> : <Info size={18} />)}
                                </div>
                                <div className="space-y-1">
                                    <h5 className="font-black text-sm text-foreground">{suggestion.title[locale]}</h5>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {suggestion.description[locale]}
                                    </p>
                                </div>
                            </div>
                            
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => router.push(suggestion.actionUrl)}
                                className="w-full justify-between hover:bg-primary/5 rounded-xl h-10 group/btn"
                            >
                                <span className="text-xs font-black">{suggestion.actionLabel[locale]}</span>
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
