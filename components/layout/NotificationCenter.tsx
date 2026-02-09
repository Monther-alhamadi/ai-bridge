"use client";

import React, { useState, useEffect } from 'react';
import { Bell, X, ShieldAlert, CheckCircle, Zap, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/Badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface NotificationCenterProps {
    locale: 'en' | 'ar';
    onClose: () => void;
}

export function NotificationCenter({ locale, onClose }: NotificationCenterProps) {
    const isRTL = locale === 'ar';
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ("Notification" in window) {
            setPermissionStatus(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!("Notification" in window)) {
            toast.error(locale === 'ar' ? 'متصفحك لا يدعم التنبيهات' : 'Browser doesn\'t support notifications');
            return;
        }

        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        
        if (permission === 'granted') {
            toast.success(locale === 'ar' ? 'تم تفعيل التنبيهات بنجاح!' : 'Notifications enabled successfully!');
            new Notification(
                locale === 'ar' ? "جسور جاهز للمساعدة!" : "Josoor is ready to help!", 
                { body: locale === 'ar' ? "ستصلك أهم التحديثات هنا فور حدوثها." : "You'll get important updates here as they happen." }
            );
        }
    };

    const sendTestNotification = () => {
        if (permissionStatus === 'granted') {
            new Notification(
                locale === 'ar' ? "رسالة تجريبية من جسور" : "Test Message from Josoor", 
                { 
                    body: locale === 'ar' ? "رائع! التنبيهات تعمل بشكل مثالي على جهازك. ✨" : "Awesome! Notifications are working perfectly on your device. ✨",
                    icon: "/hero-teacher-productivity.jpg"
                }
            );
        } else {
            toast.error(locale === 'ar' ? 'يرجى تفعيل التنبيهات أولاً' : 'Please enable notifications first');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: isRTL ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? -100 : 100 }}
            className={cn(
                "fixed top-0 bottom-0 w-full md:w-96 bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 z-[100] shadow-2xl p-6",
                isRTL ? "left-0 border-r border-l-0" : "right-0"
            )}
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500">
                        <Bell size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white">{locale === 'ar' ? 'مركز التنبيهات' : 'Notifications'}</h3>
                        <p className="text-xs text-slate-400">{locale === 'ar' ? 'رسائل من مساعدك جسور' : 'Messages from Josoor'}</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Permission Request Card */}
            {permissionStatus !== 'granted' && (
                <div className="p-5 rounded-[2rem] bg-blue-600/10 border border-blue-500/20 mb-6 space-y-4">
                    <div className="flex items-center gap-3 text-blue-400">
                        <ShieldAlert size={20} />
                        <h4 className="font-bold text-sm">{locale === 'ar' ? 'ابقَ على اتصال' : 'Stay Connected'}</h4>
                    </div>
                    <p className="text-xs text-blue-100/60 leading-relaxed">
                        {locale === 'ar' ? 'هل تود استلام تنبيهات جسور المهمة حتى وأنت خارج المتصفح وفي شاشة القفل؟' : 'Would you like to receive important alerts from Josoor even outside the browser?'}
                    </p>
                    <Button 
                        size="sm" 
                        onClick={requestPermission}
                        className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-xs h-10"
                    >
                        {locale === 'ar' ? 'تفعيل الإشعارات الآن' : 'Enable Web Push Now'}
                    </Button>
                </div>
            )}

            {/* Empty State / List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{locale === 'ar' ? 'الأحدث' : 'Recent'}</span>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                       <Zap size={18} />
                   </div>
                   <div className="space-y-1">
                       <div className="flex items-center justify-between">
                           <h5 className="font-bold text-sm text-white">{locale === 'ar' ? 'نظام جسور جاهز' : 'Josoor Systems Ready'}</h5>
                           <span className="text-[10px] text-slate-500">NOW</span>
                       </div>
                       <p className="text-xs text-slate-400 leading-relaxed">
                           {locale === 'ar' ? 'لقد تم تفعيل مركز التنبيهات الذكي بنجاح. سأتولى إبلاغك بكل جديد.' : 'Smart notification center is now active. I will keep you updated.'}
                       </p>
                   </div>
                </div>

                <Button 
                    variant="outline"
                    onClick={sendTestNotification}
                    className="w-full bg-blue-600/10 border-blue-600/30 text-blue-400 hover:bg-blue-600/20 rounded-xl py-6 h-auto"
                >
                    {locale === 'ar' ? 'أرسل رسالة تجريبية لهاتفي 📱' : 'Send Test Notification to Phone 📱'}
                </Button>
            </div>

            {/* Bottom Action */}
            <div className="absolute bottom-10 left-6 right-6">
                <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white gap-2 font-bold"
                >
                    <CheckCircle size={18} />
                    {locale === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                </Button>
            </div>
        </motion.div>
    );
}
