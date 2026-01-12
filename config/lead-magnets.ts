export const LEAD_MAGNETS: Record<string, { pdfUrl: string; tagName: string; name: { en: string; ar: string } }> = {
  // Education
  "teacher": {
    pdfUrl: "https://example.com/assets/ai-classroom-guide-2026.pdf", // User to replace with hosted PDF
    tagName: "teacher_lead",
    name: { en: "The 2026 AI Classroom Guide", ar: "حقيبة المعلم الرقمي 2026" }
  },
  "academic-researcher": {
    pdfUrl: "https://example.com/assets/ai-research-handbook.pdf",
    tagName: "researcher_lead",
    name: { en: "AI for Research: From Data to Paper", ar: "الذكاء الاصطناعي في البحث العلمي" }
  },
  
  // Tech
  "software-developer": {
    pdfUrl: "https://example.com/assets/clean-code-llm.pdf",
    tagName: "dev_lead",
    name: { en: "Engineer's Guide to LLMs: Code to Deploy", ar: "دليل المهندس للاستخدام الاحترافي لـ LLMs" }
  },
  "data-scientist": {
    pdfUrl: "https://example.com/assets/data-science-ai-kit.pdf",
    tagName: "data_lead",
    name: { en: "Data Science AI Toolkit", ar: "حقيبة أدوات علم البيانات" }
  },

  // Business
  "small-business-owner": {
    pdfUrl: "https://example.com/assets/sme-automation-guide.pdf",
    tagName: "business_lead",
    name: { en: "SME Automation Guide: Save 20h/Week", ar: "دليل أتمتة الشركات الصغيرة" }
  },
  "digital-marketer": {
    pdfUrl: "https://example.com/assets/viral-marketing-ai.pdf",
    tagName: "marketing_lead",
    name: { en: "Viral Marketing with AI", ar: "التسويق الفيروسي بالذكاء الاصطناعي" }
  },

  // Generic Fallback
  "default": {
    pdfUrl: "https://example.com/assets/ultimate-ai-starter.pdf",
    tagName: "general_lead",
    name: { en: "Ultimate AI Starter Pack", ar: "الحقيبة الشاملة للبدء في AI" }
  }
};
