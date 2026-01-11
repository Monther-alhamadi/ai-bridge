"use client";

import { useState } from "react";
import { Mail, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterSignupProps {
  profession: string;
  locale: "en" | "ar";
}

export function NewsletterSignup({ profession, locale }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, profession }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        console.error("Subscription failed");
        setStatus("idle"); // Reset on error for now
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatus("idle");
    }
  };

  const labels = {
    title: locale === "en" ? `Free ${profession} AI Toolkit` : `حقيبة أدوات الذكاء الاصطناعي المجانية لـ ${profession}`,
    subtitle: locale === "en" 
      ? `Get 50+ secret prompts and the latest AI news for your career.` 
      : `احصل على أكثر من 50 برومبت سري وأحدث أخبار الذكاء الاصطناعي لمستقبلك المهني.`,
    placeholder: locale === "en" ? "Enter your business email" : "أدخل بريدك الإلكتروني العملي",
    button: locale === "en" ? "Get Free Prompts" : "احصل على البرومبتات مجاناً",
    success: locale === "en" ? "Check your inbox! The toolkit is on its way." : "تحقق من بريدك! القائمة في طريقها إليك.",
    spam: locale === "en" ? "Zero spam. Only high-value content." : "لا رسائل مزعجة. فقط محتوى عالي القيمة.",
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border bg-card/50 backdrop-blur-md p-8 md:p-12 shadow-2xl">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 -z-10 h-64 w-64 bg-primary/10 blur-[100px] animate-pulse" />
      <div className="absolute -left-20 -bottom-20 -z-10 h-64 w-64 bg-primary/5 blur-[100px]" />

      <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
        <div className="flex-1 space-y-4 text-center md:text-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-bold text-primary">
            <Sparkles className="h-4 w-4" />
            {locale === "en" ? "Exclusive Lead Magnet" : "عرض حصري محدود"}
          </div>
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl tracking-tight">
            {labels.title}
          </h2>
          <p className="max-w-md text-lg text-muted-foreground">
            {labels.subtitle}
          </p>
        </div>

        <div className="w-full max-w-md">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl bg-green-500/10 p-10 text-center animate-in zoom-in-95 duration-500">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-600">Success!</h3>
                <p className="font-medium text-green-700/80">{labels.success}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="group relative">
                <Mail className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={labels.placeholder}
                  required
                  className="h-16 w-full rounded-2xl border bg-background ps-12 pe-4 text-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative h-16 w-full overflow-hidden rounded-2xl bg-primary px-6 py-4 text-xl font-black text-primary-foreground shadow-xl transition-all hover:bg-primary/95 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>{status === "loading" ? "..." : labels.button}</span>
                  <Send className={cn("h-5 w-5 transition-transform", status !== "loading" && "group-hover:translate-x-1 group-hover:-translate-y-1")} />
                </div>
              </button>
              <p className="text-center text-sm text-muted-foreground">
                🔒 {labels.spam}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
