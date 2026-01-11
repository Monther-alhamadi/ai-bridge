"use client";

import { useEffect, useState } from "react";
import { Zap, Gift, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StickyCTAProps {
  profession: string;
  locale: "en" | "ar";
  primaryToolLink: string;
}

export function StickyCTA({ profession, locale, primaryToolLink }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const text = {
    badge: locale === "en" ? "FREE GIFT" : "هدية مجانية",
    title: locale === "en" ? `${profession} Toolkit` : `حقيبة ${profession}`,
    cta: locale === "en" ? "Get Now" : "احصل عليها",
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 transition-all duration-500 md:bottom-10",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      <div className="group relative overflow-hidden rounded-2xl border bg-primary p-1 shadow-2xl">
        {/* Animated background flare */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-foreground/20 to-primary opacity-50 group-hover:animate-shimmer" />
        
        <div className="relative flex items-center justify-between gap-4 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
              <Gift className="h-6 w-6 animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
                {text.badge}
              </div>
              <div className="text-sm font-bold">
                {text.title}
              </div>
            </div>
          </div>

          <a
            href="#newsletter"
            className="flex items-center gap-1 rounded-lg bg-primary-foreground px-4 py-2 text-sm font-black text-primary transition-transform active:scale-95"
          >
            {text.cta}
            <ChevronRight className={cn("h-4 w-4", locale === "ar" && "rotate-180")} />
          </a>
        </div>
      </div>
    </div>
  );
}
