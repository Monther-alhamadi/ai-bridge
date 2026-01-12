"use client";

import { useState } from "react";
import { Sparkles, Bot, Code, Palette, Lightbulb, ArrowRight, BookOpen, Wrench, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface SmartInsightProps {
  profession: string;
  locale: "en" | "ar";
}

// Logic Matrix
// Logic Matrix
const LOGIC_MATRIX = {
  education_lesson: {
    keywords: ["lesson", "plan", "teach", "class", "درس", "شرح", "تحضير", "حصة"],
    promptTemplate: {
      en: "Act as a Curriculum Expert. Design a 45-minute lesson plan for [Topic] using the 5E Model (Engage, Explore, Explain, Elaborate, Evaluate)...",
      ar: "بصفتك خبير مناهج، صمم خطة درس لمدة 45 دقيقة عن [الموضوع] باستخدام نموذج 5E (التهيئة، الاستكشاف، الشرح، التوسع، التقويم)..."
    },
    strategy: {
      en: "The 5E Model ensures active learning. Using this structure saves ~30 mins of planning time.",
      ar: "نموذج 5E يضمن التعلم النشط. استخدام هذا الهيكل يوفر عليك 30 دقيقة من التحضير."
    },
    tool: { name: "Curipod", link: "https://curipod.com" }
  },
  education_quiz: {
    keywords: ["quiz", "test", "exam", "grade", "question", "اختبار", "امتحان", "أسئلة", "تقييم"],
    promptTemplate: {
      en: "Create a quiz with 5-10 questions about [Topic]. Include 3 MCQs, 2 True/False, and an Answer Key. Format it for...",
      ar: "أنشئ اختباراً من 5-10 أسئلة عن [الموضوع]. ضمن 3 أسئلة اختيار من متعدد، وسؤالين صح/خطأ، مع مفتاح الإجابة."
    },
    strategy: {
      en: "Automating quiz generation allows you to create multiple versions (A/B) to prevent cheating.",
      ar: "أتمتة بناء الاختبارات تسمح لك بإنشاء نماذج متعددة (أ/ب) لمنع الغش دون جهد إضافي."
    },
    tool: { name: "Quizizz AI", link: "https://quizizz.com" }
  },
  tech: {
    keywords: ["code", "debug", "function", "api", "app", "react", "python", "برمجة", "كود", "تطبيق"],
    promptTemplate: {
      en: "Act as a Senior Software Engineer. Review the following code snippet based on SOLID principles and suggest optimizations for...",
      ar: "أنت مهندس برمجيات Senior. قم بمراجعة الكود التالي بناءً على مبادئ SOLID و Clean Code واقترح تحسينات لـ..."
    },
    strategy: {
      en: "Focusing on Technical Debt reduction now saves 40% of maintenance time later.",
      ar: "التركيز على الديون التقنية (Technical Debt) يقلل من تكلفة الصيانة المستقبلية بنسبة 40%."
    },
    tool: { name: "Cursor AI", link: "/go/cursor-ai" }
  },
  creative: {
    keywords: ["write", "blog", "post", "social", "marketing", "ad", "image", "design", "كتابة", "مقال", "تصميم"],
    promptTemplate: {
      en: "Act as a Creative Director. Analyze the target audience for [Topic] and design an emotional campaign that triggers...",
      ar: "تقمص دور مدير إبداعي. حلل الجمهور المستهدف لـ [الموضوع] وصمم حملة إعلانية عاطفية تهدف إلى..."
    },
    strategy: {
      en: "Emotional hooks increase conversion rates by up to 40% compared to feature-listing.",
      ar: "ربط المنتج بالعاطفة (Emotional Trigger) يرفع معدل التحويل بنسبة 40% مقارنة بسرد المميزات."
    },
    tool: { name: "Jasper AI", link: "/go/jasper" }
  },
  default: {
    keywords: [],
    promptTemplate: {
      en: "Act as an expert Consultant in this field. Provide a comprehensive analysis of [Topic] related to...",
      ar: "تصرف كمستشار خبير في هذا المجال. قدم تحليلاً شاملاً لـ [الموضوع] فيما يتعلق بـ..."
    },
    strategy: {
      en: "Defining a clear persona (Expert Consultant) primes the LLM for higher quality output.",
      ar: "تحديد الهوية (مستشار خبير) يهيئ النموذج اللغوي لتقديم إجابات أكثر عمقاً واحترافية."
    },
    tool: { name: "ChatGPT Plus", link: "/go/chatgpt" }
  }
};

export function SmartInsight({ profession, locale }: SmartInsightProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const detectIntent = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Education Sub-Intents
    if (LOGIC_MATRIX.education_quiz.keywords.some(k => lowerText.includes(k))) return LOGIC_MATRIX.education_quiz;
    if (LOGIC_MATRIX.education_lesson.keywords.some(k => lowerText.includes(k))) return LOGIC_MATRIX.education_lesson;
    
    if (LOGIC_MATRIX.tech.keywords.some(k => lowerText.includes(k))) return LOGIC_MATRIX.tech;
    if (LOGIC_MATRIX.creative.keywords.some(k => lowerText.includes(k))) return LOGIC_MATRIX.creative;
    return LOGIC_MATRIX.default;
  };

  const generateInsight = () => {
    if (!input.trim()) return;
    setLoading(true);

    // Simulate "Thinking"
    setTimeout(() => {
      const intent = detectIntent(input);
      const prompt = intent.promptTemplate[locale].replace("[Topic]", input).replace("[الموضوع]", input);
      
      setResult({
        prompt: prompt,
        strategy: intent.strategy[locale],
        tool: intent.tool
      });
      setLoading(false);
      trackEvent("outcome_view", { item_name: "smart_consultant_result", context: profession });
    }, 1000);
  };

  return (
    <div className="rounded-[2.5rem] border bg-gradient-to-b from-card to-background p-8 shadow-xl">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-black">
            {locale === "en" ? "AI Consultant Engine" : "المستشار الذكي"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === "en" ? "Turn your vague idea into a professional strategy." : "حول فكرتك العامة إلى استراتيجية احترافية."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={locale === "en" ? "e.g., Plan a math lesson about fractions..." : "مثال: خطة درس رياضيات عن الكسور..."}
          className="w-full rounded-2xl border bg-muted/30 p-4 text-lg focus:border-primary focus:ring-0 min-h-[100px] resize-none"
        />
        
        <button
          onClick={generateInsight}
          disabled={loading || !input}
          className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          {loading ? (
             <span className="flex items-center justify-center gap-2">
               <Sparkles className="h-5 w-5 animate-spin" />
               {locale === "en" ? "Analyzing Intent..." : "جاري تحليل النية..."}
             </span>
          ) : (
             locale === "en" ? "Generate Strategy" : "توليد الاستراتيجية"
          )}
        </button>
      </div>

      {result && (
        <div className="mt-8 grid gap-6 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Card 1: The Prompt */}
          <div className="rounded-3xl border bg-card p-6 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500/10 p-3 rounded-bl-2xl">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
               {locale === "en" ? "Your Prompt" : "البرومبت الاحترافي"}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {result.prompt}
            </p>
            <button 
              onClick={() => navigator.clipboard.writeText(result.prompt)}
              className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
            >
              <Copy className="h-3 w-3" />
              {locale === "en" ? "Copy" : "نسخ"}
            </button>
          </div>

          {/* Card 2: The Strategy */}
          <div className="rounded-3xl border bg-card p-6 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500/10 p-3 rounded-bl-2xl">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            <h4 className="font-bold text-amber-600 mb-2">
               {locale === "en" ? "The Strategy" : "سر النجاح"}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {result.strategy}
            </p>
          </div>

          {/* Card 3: The Tool */}
          <div className="rounded-3xl border bg-card p-6 shadow-sm relative group overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
            <div className="absolute top-0 right-0 bg-primary/10 p-3 rounded-bl-2xl">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            
            {/* Expert Badge */}
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
               <CheckCircle2 className="h-3 w-3" />
               {locale === "en" ? "Expert Choice" : "خيار الخبراء"}
            </div>

            <h4 className="font-bold text-primary mb-2">
               {locale === "en" ? "Recommended Tool" : "الأداة المقترحة"}
            </h4>
            <div className="text-xl font-black mb-1">{result.tool.name}</div>
            <p className="text-xs text-muted-foreground mb-4">
              {locale === "en" ? "Perfect for this specific task." : "الأفضل لإنجاز هذه المهمة تحديداً."}
            </p>
            <Link
              href={result.tool.link}
              target="_blank"
              onClick={() => trackEvent("affiliate_click", { item_name: result.tool.name, context: "smart_consultant" })}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-2 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-95"
            >
               {locale === "en" ? "Try It Now" : "جربها الآن"}
               <ArrowRight className={cn("h-4 w-4", locale === "ar" && "rotate-180")} />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
