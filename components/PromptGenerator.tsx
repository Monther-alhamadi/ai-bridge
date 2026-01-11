"use client";

import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptGeneratorProps {
  template: string;
  profession: string;
  locale: "en" | "ar";
}

export function PromptGenerator({ template, profession, locale }: PromptGeneratorProps) {
  const [userInput, setUserInput] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!userInput.trim()) return;
    const finalPrompt = template.replace("[USER_INPUT]", userInput);
    setGeneratedPrompt(finalPrompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const labels = {
    placeholder: locale === "en" ? "Describe your task here..." : "صف مهمتك هنا...",
    button: locale === "en" ? "Generate Professional AI Prompt" : "إنشاء أمر ذكاء اصطناعي احترافي",
    outputTitle: locale === "en" ? "Your Optimized Prompt" : "الأمر المحسن الخاص بك",
    copy: locale === "en" ? "Copy to Clipboard" : "نسخ إلى الحافظة",
    copied: locale === "en" ? "Copied!" : "تم النسخ!",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-xl transition-all hover:shadow-2xl md:p-8">
      {/* Decorative element */}
      <div className="absolute -right-4 -top-4 -z-10 h-24 w-24 bg-primary/5 blur-2xl" />

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold">
            {locale === "en" ? `${profession} AI Assistant` : `مساعد ${profession} الذكي`}
          </h3>
        </div>

        <div className="space-y-4">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={labels.placeholder}
            className="min-h-[120px] w-full rounded-xl border bg-background p-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            onClick={handleGenerate}
            disabled={!userInput.trim()}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            <span>{labels.button}</span>
            <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
          </button>
        </div>

        {generatedPrompt && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-muted-foreground">{labels.outputTitle}</h4>
            </div>
            <div className="relative group/copy">
              <div className="whitespace-pre-wrap rounded-xl border bg-muted/50 p-5 text-sm leading-relaxed md:text-base">
                {generatedPrompt}
              </div>
              <button
                onClick={handleCopy}
                className={cn(
                  "absolute bottom-3 end-3 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-background border shadow-sm hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? labels.copied : labels.copy}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simple Toast Notification Overlay */}
      {copied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-white shadow-lg">
            <Check className="h-4 w-4" />
            <span className="font-medium">{labels.copied}</span>
          </div>
        </div>
      )}
    </div>
  );
}
