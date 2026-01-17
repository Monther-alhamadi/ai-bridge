"use client";

import React from "react";
import { ExternalLink, Tag, Sparkles, Zap, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { AffiliateManager } from "@/lib/affiliate-manager";
import { trackEvent } from "@/lib/analytics";
import { motion } from "framer-motion";

interface AffiliateCardProps {
  toolId: string;
  locale: "en" | "ar";
  variant?: "full" | "compact";
  className?: string;
}

export function AffiliateCard({ toolId, locale, variant = "full", className }: AffiliateCardProps) {
  const tool = AffiliateManager.getTool(toolId);
  const isRTL = locale === "ar";

  if (!tool) return null;

  const handleClick = () => {
    trackEvent("affiliate_click", {
      item_id: tool.id,
      item_name: tool.name,
      context: variant === "compact" ? "sidebar_affiliate" : "article_end_affiliate",
    });
  };

  const getStartedLabel = locale === "ar" ? "ابدأ الآن" : "Get Started";
  const copyCodeLabel = locale === "ar" ? "نسخ الكود" : "Copy Code";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/10",
        variant === "compact" ? "p-4 rounded-2xl" : "p-8",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Visual Decorations */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/20 blur-[60px]" />
      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-secondary/10 blur-[60px]" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-2 shadow-lg shadow-primary/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className={cn("font-black tracking-tight", variant === "compact" ? "text-base" : "text-xl")}>
                {tool.name}
              </h4>
              {variant !== "compact" && (
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  {locale === "ar" ? "أداة موصى بها" : "Recommended Tool"}
                </p>
              )}
            </div>
          </div>

          {(tool.coupon || tool.discount) && (
            <div className="flex flex-col gap-1 items-end">
              {tool.discount && (
                <div className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-black text-green-600 dark:text-green-400 border border-green-500/20 uppercase tracking-tighter">
                  <Gift className="h-3 w-3" />
                  {tool.discount}
                </div>
              )}
              {tool.coupon && (
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-black text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-tighter">
                  <Tag className="h-3 w-3" />
                  {tool.coupon}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className={cn(
          "text-muted-foreground leading-relaxed",
          variant === "compact" ? "text-xs line-clamp-2" : "text-sm md:text-base line-clamp-3"
        )}>
          {tool.description[locale]}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-3 mt-2">
          <a
            href={tool.defaultLink}
            onClick={handleClick}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95",
              variant === "compact" ? "py-2" : "py-4 text-base"
            )}
          >
            <span>{getStartedLabel}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          
          {tool.coupon && variant !== "compact" && (
            <button 
              onClick={() => {
                navigator.clipboard.writeText(tool.coupon!);
                alert(locale === "ar" ? "تم نسخ الكود!" : "Code copied!");
              }}
              className="flex items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-4 text-primary transition-all hover:bg-primary/10"
            >
              <Tag className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Decorative Stars */}
      {variant !== "compact" && (
        <>
          <Sparkles className="absolute top-4 right-8 h-4 w-4 text-amber-400/30 blur-[1px]" />
          <Sparkles className="absolute bottom-4 left-8 h-3 w-3 text-primary/30 blur-[1.5px]" />
        </>
      )}
    </motion.div>
  );
}
