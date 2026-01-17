"use client";

import { trackEvent } from "@/lib/analytics";
import { AffiliateManager } from "@/lib/affiliate-manager";
import { Sparkles, ExternalLink, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendedToolCardProps {
  toolId: string;
  locale: "en" | "ar";
  context?: string; // e.g. "Exam Generator Sidebar"
  variant?: "minimal" | "full";
}

export function RecommendedToolCard({ toolId, locale, context, variant = "full" }: RecommendedToolCardProps) {
  const tool = AffiliateManager.getTool(toolId);
  
  if (!tool) return null;

  const handleClick = () => {
    trackEvent("affiliate_click", {
      item_id: tool.id,
      item_name: tool.name,
      context: context || "recommendation_card",
      destination: tool.defaultLink
    });
    window.open(tool.defaultLink, "_blank");
  };

  const isRTL = locale === 'ar';

  if (variant === "minimal") {
    return (
        <button 
            onClick={handleClick}
            className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 hover:border-primary/20"
        >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>
                {locale === 'en' ? `Try ${tool.name}` : `جرب ${tool.name}`}
            </span>
        </button>
    );
  }

  return (
    <div 
        onClick={handleClick}
        className={cn(
            "group relative overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-white/50 p-5 cursor-pointer hover:shadow-lg hover:border-amber-300 transition-all duration-300",
            isRTL ? "text-right" : "text-left"
        )}
    >
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {locale === 'en' ? 'Verified Tool' : 'أداة موثوقة'}
                </span>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
            {tool.name}
        </h4>
        
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {tool.description[locale]}
        </p>

        {tool.discount && (
            <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                {tool.discount}
            </div>
        )}
        
        <div className="mt-2 text-xs font-medium text-amber-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {locale === 'en' ? 'Recommended by AI Engine' : 'توصية من المحرك الذكي'}
        </div>
    </div>
  );
}
