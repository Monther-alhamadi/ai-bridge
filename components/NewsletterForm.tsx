"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, CheckCircle, Sparkles, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  locale: "en" | "ar";
  className?: string;
}

export function NewsletterForm({ locale, className }: NewsletterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isRTL = locale === "ar";

  // Bilingual content
  const content = {
    en: {
      badge: "🎁 Free Gift Inside",
      title: "Join the Elite Teachers Network",
      subtitle: "Get your free PDF guide: 50 Magic Prompts for Modern Teachers. Automate lesson planning and student engagement in seconds.",
      leadMagnet: "📚 Free: 50 Magic Prompts Guide",
      placeholder: "Enter your email address",
      button: "Get Free Prompts",
      buttonLoading: "Sending...",
      success: "Success! Check your inbox for the guide.",
      error: "Something went wrong. Please try again.",
      privacy: "🔒 We respect your privacy. Unsubscribe anytime.",
    },
    ar: {
      badge: "🎁 هدية مجانية",
      title: "انضم إلى نخبة معلمي المستقبل",
      subtitle: "احصل فوراً على كتاب PDF يحتوي على أفضل الأوامر الجاهزة لتحضير الدروس، كتابة الاختبارات، والتعامل مع الطلاب المشاغبين باستخدام ChatGPT.",
      leadMagnet: "📚 مجاناً: دليل الـ 50 برومبت سحري",
      placeholder: "أدخل بريدك الإلكتروني",
      button: "احصل على البرومبتات مجاناً",
      buttonLoading: "جارٍ الإرسال...",
      success: "تم بنجاح! تحقق من بريدك للحصول على الدليل.",
      error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
      privacy: "🔒 نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.",
    },
  };

  const t = content[locale];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage(locale === "ar" ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        
        // Redirect after a short delay for visual confirmation
        setTimeout(() => {
          router.push(`/${locale}/newsletter/success`);
        }, 2000);
      } else {
        setStatus("error");
        setErrorMessage(t.error);
      }
    } catch (error) {
      console.error("Newsletter submission error:", error);
      setStatus("error");
      setErrorMessage(t.error);
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl p-8 md:p-12 shadow-2xl",
        className
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Glassmorphism Background Decorations */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-blue-500/5 blur-[80px]" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col gap-8">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 backdrop-blur-sm px-4 py-2 text-sm font-bold text-primary shadow-lg">
            <Gift className="h-4 w-4 animate-pulse" />
            <span>{t.badge}</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {t.title}
          </h2>

          {/* Lead Magnet Highlight */}
          <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 backdrop-blur-sm px-6 py-3 text-base md:text-lg font-bold text-foreground shadow-lg border border-amber-500/30">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span>{t.leadMagnet}</span>
          </div>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Form Section */}
        {status === "success" ? (
          <div className="mx-auto w-full max-w-md animate-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-green-500/10 backdrop-blur-sm p-8 text-center border border-green-500/30">
              <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {locale === "ar" ? "مبروك!" : "Success!"}
                </h3>
                <p className="text-sm md:text-base font-medium text-green-700 dark:text-green-300">
                  {t.success}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-4">
            {/* Email Input */}
            <div className="group relative">
              <Mail
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary",
                  isRTL ? "right-4" : "left-4"
                )}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                required
                disabled={status === "loading"}
                className={cn(
                  "h-14 w-full rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm text-base font-medium ring-offset-background transition-all",
                  "placeholder:text-muted-foreground/60",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isRTL ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                )}
              />
            </div>

            {/* Error Message */}
            {status === "error" && errorMessage && (
              <p className="text-sm text-red-500 text-center font-medium animate-in fade-in duration-300">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "group relative h-14 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary font-bold text-lg text-primary-foreground shadow-xl",
                "transition-all duration-300",
                "hover:shadow-2xl hover:scale-[1.02] active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
            >
              {/* Animated Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <div className="relative flex items-center justify-center gap-2">
                <span>{status === "loading" ? t.buttonLoading : t.button}</span>
                {status === "loading" ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <ArrowRight
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isRTL ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"
                    )}
                  />
                )}
              </div>
            </button>

            {/* Privacy Note */}
            <p className="text-center text-xs md:text-sm text-muted-foreground">
              {t.privacy}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
