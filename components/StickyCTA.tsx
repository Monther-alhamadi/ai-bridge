"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface StickyCTAProps {
  profession?: string;
  context?: "tool" | "comparison" | "news";
  locale: "en" | "ar";
  primaryToolLink: string;
}

export function StickyCTA({ profession, context = "tool", locale, primaryToolLink }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000); // Smart Logic: Show after 15 seconds

    return () => clearTimeout(timer);
  }, []);

  const contentMap = {
    tool: {
      badge: locale === "en" ? "FREE GIFT" : "هدية مجانية",
      title: locale === "en" ? `${profession} Toolkit` : `حقيبة ${profession}`,
      cta: locale === "en" ? "Get Now" : "احصل عليها",
    },
    comparison: {
      badge: locale === "en" ? "WINNER DEAL" : "عرض الفائز",
      title: locale === "en" ? "Exclusive Discount" : "خصم حصري للأداة الفائزة",
      cta: locale === "en" ? "Claim Offer" : "تفعيل الخصم",
    },
    news: {
      badge: locale === "en" ? "STAY AHEAD" : "كن سباقاً",
      title: locale === "en" ? "Get New Tools Daily" : "أحدث الأدوات يومياً",
      cta: locale === "en" ? "Join Free" : "اشترك مجاناً",
    }
  };

  const text = contentMap[context];

  return (
    <div
      className={cn(
        "z-50 fixed bottom-0 left-0 right-0 p-4 transition-transform duration-500 ease-in-out md:hidden",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="mx-auto max-w-sm rounded-[2rem] border bg-background/90 p-4 shadow-2xl backdrop-blur-xl ring-1 ring-primary/20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
              {text.badge}
            </span>
            <span className="font-bold text-foreground">
              {text.title}
            </span>
          </div>
          <Link
            href={primaryToolLink}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-transform active:scale-95 animate-pulse hover:animate-none"
          >
            {text.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
