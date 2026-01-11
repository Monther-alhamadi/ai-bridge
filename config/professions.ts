export interface Profession {
  id: string;
  slug: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  icon: string;
  aiPromptTemplate: {
    en: string;
    ar: string;
  };
  benefits: {
    en: string[];
    ar: string[];
  };
}

export const professions: Profession[] = [
  {
    id: "1",
    slug: "teacher",
    title: {
      en: "Teacher",
      ar: "معلم",
    },
    description: {
      en: "Create high-quality lesson plans and assessments in seconds.",
      ar: "قم بإنشاء خطط دروس وتقييمات عالية الجودة في ثوانٍ.",
    },
    icon: "BookOpen",
    aiPromptTemplate: {
      en: "Act as an expert educational consultant. Help me create a detailed lesson plan for [USER_INPUT]. Include learning objectives, a step-by-step 45-minute activity, and 5 assessment questions.",
      ar: "تقمص دور خبير تربوي. ساعدني في تحضير درس احترافي عن [USER_INPUT]. يجب أن يشمل التحضير: أهداف التعلم، خطة زمنية لمدة 45 دقيقة، و5 أسئلة تقييمية للمتفوّقين.",
    },
    benefits: {
      en: ["Save hours on lesson planning", "Generate high-quality assessments", "Optimize student learning outcomes"],
      ar: ["توفير ساعات في تخطيط الدروس", "إنشاء تقييمات عالية الجودة", "تحسين نتائج تعلم الطلاب"],
    },
  },
  {
    id: "2",
    slug: "content-creator",
    title: {
      en: "Content Creator",
      ar: "صناع المحتوى",
    },
    description: {
      en: "Generate viral video scripts and catchy titles using AI.",
      ar: "قم بإنشاء سيناريوهات فيديو وعناوين جذابة باستخدام الذكاء الاصطناعي.",
    },
    icon: "Video",
    aiPromptTemplate: {
      en: "Act as a viral marketing expert. Create a script and 5 catchy titles for a video about [USER_INPUT]. Focus on a high-retention hook and a clear call to action.",
      ar: "تقمص دور خبير تسويق فيروسي. اكتب لي سيناريو فيديو و5 عناوين جذابة حول [USER_INPUT]. ركز على جملة افتتاحية قوية تجذب المشاهد ودعوة صريحة لاتخاذ إجراء (CTA).",
    },
    benefits: {
      en: ["Boost viewer retention", "Increase click-through rates", "Speed up writing workflow"],
      ar: ["زيادة تفاعل المشاهدين", "زيادة معدلات النقر", "تسريع سير عمل الكتابة"],
    },
  },
  {
    id: "3",
    slug: "business-owner",
    title: {
      en: "Small Business Owner",
      ar: "أصحاب المشاريع الصغيرة",
    },
    description: {
      en: "Professional marketing posts and email campaigns for your business.",
      ar: "منشورات تسويقية احترافية وحملات بريد إلكتروني لعملك.",
    },
    icon: "Store",
    aiPromptTemplate: {
      en: "Act as a business strategist. Write a professional marketing post for social media and an email blast to promote [USER_INPUT]. Highlight the benefits and solve a customer pain point.",
      ar: "تقمص دور مستشار استراتيجي للمشاريع. اكتب منشوراً تسويقياً احترافياً لمنصات التواصل وبريداً إلكترونياً ترويجياً لـ [USER_INPUT]. ركز على الفوائد وحل مشكلة العميل.",
    },
    benefits: {
      en: ["Improve customer conversion", "Professional brand messaging", "Save on marketing costs"],
      ar: ["تحسين تحويل العملاء", "رسائل علامة تجارية احترافية", "توفير تكاليف التسويق"],
    },
  },
  {
    id: "4",
    slug: "accountant",
    title: {
      en: "Accountant",
      ar: "محاسب",
    },
    description: {
      en: "Streamline financial reporting and audit preparations with AI.",
      ar: "تبسيط التقارير المالية وتحضيرات التدقيق باستخدام الذكاء الاصطناعي.",
    },
    icon: "Calculator",
    aiPromptTemplate: {
      en: "Act as a Senior Financial Analyst. Review and provide insights on the following accounting task: [USER_INPUT]. Ensure compliance with international financial reporting standards.",
      ar: "اعمل كمحلل مالي أول. راجع وقدم رؤى حول المهمة المحاسبية التالية: [USER_INPUT]. تأكد من الامتثال للمعايير الدولية للتقارير المالية.",
    },
    benefits: {
      en: ["Financial data analysis", "Fraud detection patterns", "Automated expense categorizing"],
      ar: ["تحليل البيانات المالية", "أنماط اكتشاف الاحتيال", "تصنيف المصاريف آلياً"],
    },
  },
  {
    id: "5",
    slug: "lawyer",
    title: {
      en: "Lawyer",
      ar: "محامٍ",
    },
    description: {
      en: "Accelerate legal research and document drafting using AI logic.",
      ar: "تسريع البحث القانوني وصياغة الوثائق باستخدام منطق الذكاء الاصطناعي.",
    },
    icon: "Scale",
    aiPromptTemplate: {
      en: "Act as a Legal Counselor. Analyze the following legal query or document: [USER_INPUT]. Highlight potential risks, suggest improvements, and reference standard legal frameworks.",
      ar: "اعمل كمستشار قانوني. حلل الاستفسار أو الوثيقة القانونية التالية: [USER_INPUT]. سلط الضوء على المخاطر المحتملة، واقترح التحسينات، وارجع إلى الأطر القانونية المعيارية.",
    },
    benefits: {
      en: ["Rapid legal research", "Contract risk assessment", "Automated document templates"],
      ar: ["بحث قانوني سريع", "تقييم مخاطر العقود", "نماذج وثائق آلية"],
    },
  },
];
