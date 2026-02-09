"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [magicLinkSent, setMagicLinkSent] = useState(false);
    const router = useRouter();
    const isRTL = locale === 'ar';

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/${locale}/tools/teacher`,
            },
        });
        if (error) toast.error(error.message);
        setLoading(false);
    };

    const handleMagicLinkLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return toast.error(locale === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
        
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/${locale}/tools/teacher`,
            },
        });

        if (error) {
            toast.error(error.message);
        } else {
            setMagicLinkSent(true);
            toast.success(locale === 'ar' ? 'تحقق من بريدك الإلكتروني!' : 'Check your email!');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 overflow-hidden relative" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 p-96 bg-primary/20 rounded-full blur-[140px] -mr-48 -mt-48 pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 p-80 bg-blue-600/10 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-10 space-y-4">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-primary to-blue-400 p-0.5 shadow-2xl shadow-primary/20"
                    >
                        <div className="w-full h-full rounded-[1.9rem] bg-slate-900 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-white animate-pulse" />
                        </div>
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            {locale === 'ar' ? 'جسر الذكاء' : 'AI Bridge'}
                        </h1>
                        <p className="text-blue-200/50 font-medium">
                            {locale === 'ar' ? 'مستقبلك المهني بلمسة ذكاء' : 'Your professional future, intelligently crafted'}
                        </p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
                    
                    {!magicLinkSent ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-white">
                                    {locale === 'ar' ? 'تسجيل الدخول' : 'Welcome Back'}
                                </h2>
                                <p className="text-sm text-slate-400">
                                    {locale === 'ar' ? 'انضم إلى عائلة المعلمين المبدعين' : 'Join our family of creative teachers'}
                                </p>
                            </div>

                            <Button 
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full bg-white text-slate-900 hover:bg-slate-100 h-14 rounded-2xl font-black transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                                {locale === 'ar' ? 'الدخول بواسطة جوجل' : 'Continue with Google'}
                            </Button>

                            <div className="relative flex items-center justify-center py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <span className="relative px-4 bg-[#020617]/50 text-[10px] uppercase font-black tracking-widest text-slate-500 backdrop-blur-md">
                                    {locale === 'ar' ? 'أو عبر البريد' : 'Or via email'}
                                </span>
                            </div>

                            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300 ml-2 mr-2 font-bold">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <Input 
                                            type="email"
                                            placeholder="name@school.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-14 bg-white/5 border-white/10 text-white pl-12 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <Button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 h-14 rounded-2xl font-black transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                    {locale === 'ar' ? 'أرسل رابط الدخول' : 'Send Magic Link'}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10 space-y-6"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20">
                                <Mail size={32} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white">{locale === 'ar' ? 'تم الإرسال!' : 'Check your mail!'}</h3>
                                <p className="text-slate-400 leading-relaxed font-medium px-4">
                                    {locale === 'ar' 
                                        ? `لقد أرسلنا رابطاً سحرياً إلى ${email}. اضغط عليه لتدخل النظام فوراً.` 
                                        : `We've sent a magic link to ${email}. Click it to sign in instantly.`}
                                </p>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => setMagicLinkSent(false)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/5 font-black"
                            >
                                {locale === 'ar' ? 'استخدام بريد آخر' : 'Use another email'}
                            </Button>
                        </motion.div>
                    )}
                </div>

                {/* Footer Links */}
                <div className="text-center mt-8">
                    <button 
                        onClick={() => router.push(`/${locale}`)}
                        className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2 mx-auto"
                    >
                        {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                        <ArrowRight className={isRTL ? "rotate-180 w-4 h-4" : "w-4 h-4"} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
