"use client";

import { Info, Target, Landmark, ShieldCheck } from "lucide-react";

interface BuyersGuideProps {
  toolA: string;
  toolB: string;
  locale: "en" | "ar";
}

export function BuyersGuide({ toolA, toolB, locale }: BuyersGuideProps) {
  const content = {
    title: locale === "en" ? "Buyer's Guide: How to Choose" : "دليل الشراء: كيف تختار الأداة المناسبة؟",
    intro: locale === "en" 
      ? `Choosing between ${toolA} and ${toolB} depends on your primary use case. Here are the 4 key factors to consider:` 
      : `الاختيار بين ${toolA} و ${toolB} يعتمد على حالة الاستخدام الأساسية الخاصة بك. إليك 4 عوامل رئيسية يجب مراعاتها:`,
    factors: [
      {
        icon: Target,
        title: locale === "en" ? "Core Purpose" : "الغرض الأساسي",
        description: locale === "en" 
          ? "Are you focused on creative output or technical accuracy? Creative tasks favor nuanced models, while technical tasks require strict logic."
          : "هل تركز على المخرجات الإبداعية أم الدقة التقنية؟ المهام الإبداعية تفضل النماذج ذات التفاصيل الدقيقة، بينما تتطلب المهام التقنية منطقاً صارماً."
      },
      {
        icon: Landmark,
        title: locale === "en" ? "Budget & ROI" : "الميزانية والعائد",
        description: locale === "en" 
          ? "Evaluate the cost vs the time saved. If a more expensive tool saves you 2 hours a week, the ROI is massive."
          : "قيم التكفة مقابل الوقت الموفر. إذا كانت الأداة الأغلى توفر لك ساعتين في الأسبوع، فإن العائد على الاستثمار يكون ضخماً."
      },
      {
        icon: ShieldCheck,
        title: locale === "en" ? "Privacy & Security" : "الخصوصية والأمان",
        description: locale === "en" 
          ? "Check how your data is handled. Professional workflows often require enterprise-grade security."
          : "تحقق من كيفية التعامل مع بياناتك. غالباً ما تتطلب مسارات العمل الاحترافية أماناً من الدرجة المؤسسية."
      },
      {
        icon: Info,
        title: locale === "en" ? "Ease of Integration" : "سهولة التكامل",
        description: locale === "en" 
          ? "Does the tool fit into your existing workflow (API, VS Code, Browser)? Frictionless tools are used more often."
          : "هل تتناسب الأداة مع مسار عملك الحالي (API، VS Code، المتصفح)؟ الأدوات السهلة يتم استخدامها بشكل متكرر أكثر."
      }
    ]
  };

  return (
    <section className="rounded-[2.5rem] border bg-card/40 p-10 md:p-16 space-y-12">
      <div className="max-w-3xl space-y-4">
        <h2 className="text-3xl font-black md:text-4xl">{content.title}</h2>
        <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4 rtl:border-r-4 rtl:border-l-0 rtl:pr-4">
          {content.intro}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {content.factors.map((factor, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <factor.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">{factor.title}</h3>
            <p className="text-muted-foreground leading-snug">
              {factor.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
