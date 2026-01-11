export interface NewsItem {
  id: string;
  title: { en: string; ar: string; };
  summary: { en: string; ar: string; }; // The "AI Summary"
  date: string;
  tag: { en: string; ar: string; };
  image: string; // Placeholder or Lucide icon name
  link: string;
}

export const aiNews: NewsItem[] = [
  {
    id: "1",
    title: { 
      en: "Midjourney v6 Alpha Released: Hyper-Realism is Here", 
      ar: "إطلاق نسخة Midjourney v6 Alpha: الواقعية المفرطة أصبحت هنا" 
    },
    summary: { 
      en: "The new model handles text within images perfectly and improved photorealism by 40%. A must-try for designers.", 
      ar: "النموذج الجديد يتعامل مع النصوص داخل الصور بدقة مثالية وحسن الواقعية بنسبة 40%. تجربة إلزامية للمصممين." 
    },
    date: "2024-03-15",
    tag: { en: "Design", ar: "تصميم" },
    image: "Palette",
    link: "https://midjourney.com"
  },
  {
    id: "2",
    title: { 
      en: "Google Gemini 1.5 Pro: Massive 1M Token Context", 
      ar: "جوجل Gemini 1.5 Pro: نافذة سياق ضخمة بمليون رمز" 
    },
    summary: { 
      en: "You can now upload entire codebases or 500-page PDFs. This changes the game for researchers and developers.", 
      ar: "يمكنك الآن رفع قواعد بيانات برمجية كاملة أو ملفات PDF من 500 صفحة. هذا يغير قواعد اللعبة للباحثين والمبرمجين." 
    },
    date: "2024-03-10",
    tag: { en: "Tech", ar: "تقنية" },
    image: "Zap",
    link: "https://deepmind.google"
  },
  {
    id: "3",
    title: { 
      en: "Claude 3 Opus Beats GPT-4 in Benchmarks", 
      ar: "نظام Claude 3 Opus يتفوق على GPT-4 في المعايير" 
    },
    summary: { 
      en: "Anthropic's new model shows superior reasoning in math and coding. The subscription is worth every penny.", 
      ar: "نموذج Anthropic الجديد يظهر منطقاً متفوقاً في الرياضيات والبرمجة. الاشتراك يستحق كل فلس." 
    },
    date: "2024-03-05",
    tag: { en: "Model", ar: "نموذج" },
    image: "BrainCircuit",
    link: "https://anthropic.com"
  }
];
