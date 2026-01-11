export interface ComparisonPoint {
  feature: { en: string; ar: string; };
  toolA_value: { en: string; ar: string; };
  toolB_value: { en: string; ar: string; };
  winner: "A" | "B" | "Tie";
}

export interface Comparison {
  id: string;
  slug: string; // e.g., "chatgpt-vs-claude"
  toolA: {
    name: string;
    icon: string;
    affiliateUrl?: string;
  };
  toolB: {
    name: string;
    icon: string;
    affiliateUrl?: string;
  };
  title: { en: string; ar: string; };
  summary: { en: string; ar: string; };
  points: ComparisonPoint[];
  verdict: {
    winnerName: string;
    description: { en: string; ar: string; };
  };
}

export const comparisons: Comparison[] = [
  {
    id: "1",
    slug: "chatgpt-vs-claude",
    toolA: {
      name: "ChatGPT (GPT-4)",
      icon: "Bot",
      affiliateUrl: "https://openai.com",
    },
    toolB: {
      name: "Claude 3.5 Sonnet",
      icon: "Sparkles",
      affiliateUrl: "https://anthropic.com",
    },
    title: {
      en: "ChatGPT vs Claude 3.5: Which is Best for Coding?",
      ar: "شات جي بي تي ضد كلود 3.5: أيهما الأفضل للبرمجة؟",
    },
    summary: {
      en: "The ultimate battle of the LLMs. We tested both on complex coding tasks, creative writing, and logic. Here is the definitive answer.",
      ar: "المعركة النهائية بين نماذج اللغة الكبيرة. قمنا باختبار كلاهما في مهام البرمجة المعقدة، الكتابة الإبداعية، والمنطق. إليك الإجابة النهائية.",
    },
    points: [
      {
        feature: { en: "Coding Capabilities", ar: "قدرات البرمجة" },
        toolA_value: { en: "Strong, but can be verbose", ar: "قوي، ولكن قد يكون كثير الكلام" },
        toolB_value: { en: "Extremely concise and accurate", ar: "دقيق ومختصر للغاية" },
        winner: "B",
      },
      {
        feature: { en: "Context Window", ar: "نافذة السياق" },
        toolA_value: { en: "128k Tokens", ar: "128 ألف رمز" },
        toolB_value: { en: "200k Tokens", ar: "200 ألف رمز" },
        winner: "B",
      },
      {
        feature: { en: "Creative Writing", ar: "الكتابة الإبداعية" },
        toolA_value: { en: "Good, slight robotic tone", ar: "جيد، مع نبرة آلية طفيفة" },
        toolB_value: { en: "More natural and human-like", ar: "أكثر طبيعية وشبه بشري" },
        winner: "B",
      },
    ],
    verdict: {
      winnerName: "Claude 3.5 Sonnet",
      description: {
        en: "For developers and writers, Claude 3.5 takes the crown with superior nuance and coding accuracy.",
        ar: "للمطورين والكتاب، يتوج كلود 3.5 باللقب بفضل دقة البرمجة والفروق الدقيقة المتفوقة.",
      },
    },
  },
  {
    id: "2",
    slug: "midjourney-vs-dalle-3",
    toolA: {
      name: "Midjourney v6",
      icon: "Palette",
      affiliateUrl: "https://midjourney.com",
    },
    toolB: {
      name: "DALL-E 3 (via ChatGPT)",
      icon: "Image",
      affiliateUrl: "https://openai.com",
    },
    title: {
      en: "Midjourney vs DALL-E 3: Which is Better for Commercial Art?",
      ar: "Midjourney ضد DALL-E 3: أيهما الأفضل للفن التجاري؟",
    },
    summary: {
      en: "Choosing between the king of photorealism and the king of prompt adherence. We compare detail, ease of use, and pricing.",
      ar: "الاختيار بين ملك الواقعية وملك الالتزام بالوصف. نقارن التفاصيل، سهولة الاستخدام، والأسعار.",
    },
    points: [
      {
        feature: { en: "Photorealism", ar: "الواقعية الفوتوغرافية" },
        toolA_value: { en: "Unmatched depth and texture", ar: "عمق وأنسجة لا مثيل لها" },
        toolB_value: { en: "Good, but feels 'smoothed'", ar: "جيد، لكنه يبدو 'ناعماً' جداً" },
        winner: "A",
      },
      {
        feature: { en: "Prompt Adherence", ar: "الالتزام بالبرومبت" },
        toolA_value: { en: "Requires specific keywords", ar: "يتطلب كلمات مفتاحية معينة" },
        toolB_value: { en: "Understands natural language perfectly", ar: "يفهم اللغة الطبيعية بشكل مثالي" },
        winner: "B",
      },
    ],
    verdict: {
      winnerName: "Midjourney v6",
      description: {
        en: "For professional artists and high-end results, Midjourney remains the industry standard.",
        ar: "للفنانين المحترفين والنتائج عالية الجودة، يظل Midjourney هو المعيار الصناعي.",
      },
    },
  },
  {
    id: "3",
    slug: "github-copilot-vs-cursor",
    toolA: {
      name: "GitHub Copilot",
      icon: "Code",
      affiliateUrl: "https://github.com/features/copilot",
    },
    toolB: {
      name: "Cursor AI",
      icon: "Terminal",
      affiliateUrl: "https://cursor.sh",
    },
    title: {
      en: "GitHub Copilot vs Cursor: The Best AI Code Editor in 2024",
      ar: "GitHub Copilot ضد Cursor: أفضل محرر أكواد ذكاء اصطناعي في 2024",
    },
    summary: {
      en: "Is an extension enough, or do you need a dedicated AI-native IDE? We test the integration of Claude and GPT-4 in both.",
      ar: "هل تكفي الإضافة، أم تحتاج لمحرر أكواد مبني للذكاء الاصطناعي؟ نختبر تكامل Claude و GPT-4 في كليهما.",
    },
    points: [
      {
        feature: { en: "IDE Integration", ar: "التكامل مع المحرر" },
        toolA_value: { en: "Extension for VS Code/JetBrains", ar: "إضافة لـ VS Code و JetBrains" },
        toolB_value: { en: "Dedicated AI-Native fork of VS Code", ar: "محرر مستقل مبني للذكاء الاصطناعي" },
        winner: "B",
      },
    ],
    verdict: {
      winnerName: "Cursor AI",
      description: {
        en: "Cursor's deep integration with the filesystem and AI indexing makes it superior for large projects.",
        ar: "تكامل Cursor العميق مع ملفات النظام وفهرسة الذكاء الاصطناعي يجعله متفوقاً للمشاريع الكبيرة.",
      },
    },
  },
  {
    id: "4",
    slug: "perplexity-vs-gemini",
    toolA: {
      name: "Perplexity AI",
      icon: "Search",
      affiliateUrl: "https://perplexity.ai",
    },
    toolB: {
      name: "Google Gemini",
      icon: "Zap",
      affiliateUrl: "https://gemini.google.com",
    },
    title: {
      en: "Perplexity AI vs Google Gemini: The Future of Search",
      ar: "Perplexity AI ضد Google Gemini: مستقبل البحث",
    },
    summary: {
      en: "Searching vs Asking. We compare citation accuracy, real-time data access, and mobile experience.",
      ar: "البحث مقابل السؤال. نقارن دقة المراجع، الوصول للبيانات الحية، وتجربة الجوال.",
    },
    points: [
      {
        feature: { en: "Citations", ar: "المراجع والمصادر" },
        toolA_value: { en: "Always provides clear source links", ar: "يوفر دائماً روابط مصادر واضحة" },
        toolB_value: { en: "Sometimes hallucinates sources", ar: "أحياناً يهلوس بالمصادر" },
        winner: "A",
      },
    ],
    verdict: {
      winnerName: "Perplexity AI",
      description: {
        en: "For research and accurate data gathering, Perplexity is leagues ahead with its citation system.",
        ar: "للأبحاث وجمع البيانات الدقيقة، يتفوق Perplexity بمراحل بفضل نظام المراجع الخاص به.",
      },
    },
  },
];
