"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: "en" | "ar";
}

export function RewardModal({ isOpen, onClose, locale }: RewardModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border bg-card p-0 shadow-2xl"
            >
              {/* Header / Banner */}
              <div className="bg-primary px-8 py-8 text-center text-primary-foreground">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <Gift className="h-8 w-8 animate-bounce" />
                </div>
                <h2 className="text-2xl font-black md:text-3xl">
                  {locale === "en" ? "Thank You for Rating!" : "شكراً لك على التقييم!"}
                </h2>
                <p className="mt-2 opacity-90">
                  {locale === "en" 
                    ? "Your feedback helps the community. Here is a gift for you." 
                    : "رأيك يساعد المجتمع. إليك هدية تقديرية منا."}
                </p>
              </div>

              {/* Content */}
              <div className="space-y-6 p-8">
                <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-muted/30 p-6 text-center">
                  <h3 className="text-lg font-bold">
                    {locale === "en" ? "Free AI Prompt Cheatsheet" : "كتيب اختصارات الذكاء الاصطناعي"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {locale === "en" ? "PDF • 50+ Copy-Paste Prompts" : "ملف PDF • أكثر من 50 قالب جاهز"}
                  </p>
                </div>

                <button
                  onClick={() => {
                     // In reality, this would trigger a download or email
                     window.open("https://example.com/download.pdf", "_blank");
                     onClose();
                  }}
                  className="group relative w-full overflow-hidden rounded-xl bg-primary px-6 py-4 text-center font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Download className="h-5 w-5" />
                    {locale === "en" ? "Download Free Gift" : "تحميل الهدية مجاناً"}
                  </span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full text-center text-sm font-medium text-muted-foreground hover:underline"
                >
                  {locale === "en" ? "No thanks, maybe later" : "لا شكراً، ربما لاحقاً"}
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-black/10 p-2 text-white/80 transition-colors hover:bg-black/20"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
