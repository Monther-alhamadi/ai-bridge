"use client";

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void; // New prop for simulation
  locale: 'en' | 'ar';
}

export function PremiumModal({ isOpen, onClose, onUpgrade, locale }: PremiumModalProps) {
  const isRTL = locale === 'ar';

  const features = [
    { 
      en: "Full Textbook Indexing (Unlimited Pages)", 
      ar: "فهرسة الكتب الكاملة (صفحات غير محدودة)" 
    },
    { 
      en: "Advanced AI Lesson Planning", 
      ar: "تخطيط دروس متقدم بالذكاء الاصطناعي" 
    },
    { 
      en: "High-Priority AI Processing", 
      ar: "معالجة ذكية ذات أولوية قصوى" 
    },
    { 
      en: "Export to Word & PDF", 
      ar: "تصدير إلى Word و PDF" 
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[500px] border-none bg-transparent p-0 overflow-hidden",
        isRTL ? "font-cairo" : "font-sans"
      )}>
        <div className="relative bg-card/60 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 p-48 bg-primary/20 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none" />
          <div className="absolute bottom-0 left-0 p-48 bg-blue-500/10 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />

          <div className="relative p-8 space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-lg ring-4 ring-orange-500/20">
                <Crown className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-3xl font-black">
                  {isRTL ? "افتح القوة الكاملة" : "Unlock Full Power"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-lg">
                  {isRTL 
                    ? "هذا الملف يحتاج لقوة معالجة عالية. اشترك الآن لفتح التحليل الكامل." 
                    : "This file is large and requires high processing power. Subscribe now to unlock full analysis."}
                </DialogDescription>
              </div>
            </div>

            <div className="grid gap-4 bg-white/40 dark:bg-slate-900/40 p-6 rounded-[2rem] border border-white/20">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-green-500/20 p-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium text-sm">
                    {isRTL ? feature.ar : feature.en}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-primary to-blue-600 hover:shadow-xl hover:shadow-primary/20 transition-all scale-100 hover:scale-[1.02]"
                onClick={() => window.open('/pricing', '_blank')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isRTL ? "اشترك الآن - 9.99$ شهرياً" : "Subscribe Now - $9.99/mo"}
              </Button>
              
              {/* DEV ONLY: Verification Bypass */}
              {onUpgrade && (
                  <button 
                    onClick={onUpgrade}
                    className="w-full h-10 rounded-xl text-xs font-bold bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-all border border-green-500/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {isRTL ? "محاكاة اشتراك ناجح (للمطورين)" : "Simulate Successful Subscription (Dev)"}
                  </button>
              )}
              <button 
                onClick={onClose}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isRTL ? "ربما لاحقاً" : "Maybe later"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
