export interface ToolReview {
  name: string;
  description: { en: string; ar: string; };
  pros: { en: string[]; ar: string[]; };
  cons: { en: string[]; ar: string[]; };
  price: { en: string; ar: string; };
  rating: number;
  affiliateUrl?: string; // Optional: If provided, shows "Get Exclusive Deal"
  link: string; // Fallback: Regular "Visit Site" link
  badge?: { en: string; ar: string; }; // Optional: "Top Pick", "Best Value", etc.
}


export interface FAQ {
  question: { en: string; ar: string; };
  answer: { en: string; ar: string; };
}

export interface Profession {
  id: string;
  slug: string;
  title: { en: string; ar: string; };
  description: { en: string; ar: string; };
  icon: string;
  aiPromptTemplate: { en: string; ar: string; };
  benefits: { en: string[]; ar: string[]; };
  faqs: FAQ[];
  recommendedTools: ToolReview[];
  smartAnalysis: { en: string; ar: string; }; 
  seoTitle?: { en: string; ar: string; };      // NEW: For <title> tag
  seoDescription?: { en: string; ar: string; }; // NEW: For <meta name="description">
}


export const professions: Profession[] = [
  {
    id: "1",
    slug: "teacher",
    title: { en: "Teacher", ar: "معلم" },
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
    faqs: [
      {
        question: { en: "Can AI really create a lesson plan?", ar: "هل يمكن للذكاء الاصطناعي فعلاً إنشاء خطة درس؟" },
        answer: { en: "Yes, AI can generate structured plans, but teachers should personalize them for their classroom needs.", ar: "نعم، يمكنه توليد خطط منظمة، ولكن يجب على المعلم تخصيصها لتناسب احتياجات طلابه." }
      }
    ],
    recommendedTools: [
      {
        name: "MagicSchool AI",
        description: { en: "An all-in-one AI platform for teachers.", ar: "منصة ذكاء اصطناعي شاملة للمعلمين." },
        pros: { en: ["User friendly", "Built for educators"], ar: ["سهل الاستخدام", "مصمم خصيصاً للتريويين"] },
        cons: { en: ["Free version limits"], ar: ["قيود في النسخة المجانية"] },
        price: { en: "Free / $9.99 monthly", ar: "مجاني / 9.99$ شهرياً" },
        rating: 4.8,
        affiliateUrl: "https://magicschool.ai/?ref=aibridge",
        link: "https://magicschool.ai",
        badge: { en: "Top Pick", ar: "الأفضل للمعلمين" }
      }
    ],
    smartAnalysis: {
      en: "AI is revolutionizing education by acting as a 24/7 teaching assistant. For teachers, the biggest gain is specialized content creation—shifting from generic lesson plans to personalized learning paths that target individual student needs without increasing the workload.",
      ar: "يُغير الذكاء الاصطناعي وجه التعليم من خلال عمله كمساعد تدريس على مدار الساعة. بالنسبة للمعلمين، العائد الأكبر هو 'تخصيص المحتوى'، حيث ينتقل المعلم من الخطط العامة إلى مسارات تعلم فردية تستهدف احتياجات كل طالب دون زيادة في أعباء العمل."
    },
    seoTitle: {
      en: "Free AI Lesson Planner & Exam Generator for Teachers | AI Bridge",
      ar: "أداة تحضير الدروس وتوليد الاختبارات بالذكاء الاصطناعي مجاناً | AI Bridge"
    },
    seoDescription: {
      en: "The ultimate AI assistant for teachers. Generate lesson plans, create quizzes, and automate grading in seconds. Try the Teacher OS for free.",
      ar: "المساعد الذكي الأول للمعلمين العرب. حضر دروسك، صمم اختباراتك، واحصل على أدوات إدارة الصف مجاناً باستخدام الذكاء الاصطناعي."
    }
  },
  {
    id: "2",
    slug: "content-creator",
    title: { en: "Content Creator", ar: "صناع المحتوى" },
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
    faqs: [
      {
        question: { en: "How to make a video viral?", ar: "كيف تجعل الفيديو ينتشر بسرعة؟" },
        answer: { en: "Focus on the first 3 seconds (The Hook) and use professional scripts.", ar: "ركز على أول 3 ثوانٍ (الخاطفة) واستخدم سيناريوهات احترافية." }
      }
    ],
    recommendedTools: [
      {
        name: "CapCut AI",
        description: { en: "Smart video editing with AI features.", ar: "تحرير فيديو ذكي مع ميزات الذكاء الاصطناعي." },
        pros: { en: ["Powerful auto-captions", "Mobile friendly"], ar: ["ترجمة تلقائية قوية", "سهل الاستخدام على الجوال"] },
        cons: { en: ["Advanced features need Pro"], ar: ["الميزات المتقدمة تطلب اشتراك Pro"] },
        price: { en: "Free / Subscription", ar: "مجاني / اشتراك" },
        rating: 4.9,
        affiliateUrl: "https://capcut.com/?token=aibridge",
        link: "https://capcut.com",
        badge: { en: "Most Popular", ar: "الأكثر شعبية" }
      }
    ],
    smartAnalysis: {
      en: "In the attention economy, AI is the ultimate multiplier for content creators. Beyond simple automation, it enables high-speed iteration: testing multiple hooks, scripts, and formats in the time it used to take to write a single post, directly impacting engagement metrics.",
      ar: "في اقتصاد الانتباه، يعد الذكاء الاصطناعي العامل المضاعف الأقوى لصناع المحتوى. فبعيداً عن الأتمتة البسيطة، يتيح الذكاء الاصطناعي 'التكرار السريع': تجربة عدة جمل افتتاحية، سيناريوهات، وتنسيقات في نفس الوقت الذي كان يستغرقه كتابة منشور واحد، مما يؤثر مباشرة على مقاييس التفاعل."
    },
    seoTitle: {
      en: "AI Viral Script Generator & Video Hooks | For Content Creators",
      ar: "مولد سيناريوهات الفيديو والعناوين الفيروسية بالذكاء الاصطناعي"
    },
    seoDescription: {
      en: "Stop staring at a blank page. Generate viral YouTube, TikTok, and Instagram scripts in seconds with AI Bridge. Free for creators.",
      ar: "توقف عن التحديق في الورقة البيضاء. ولد سيناريوهات يوتيوب وتيك توك فيروسية في ثوانٍ مع AI Bridge."
    }
  },
  {
    id: "3",
    slug: "business-owner",
    title: { en: "Small Business Owner", ar: "أصحاب المشاريع الصغيرة" },
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
    faqs: [
      {
        question: { en: "Can AI help in sales?", ar: "هل يمكن للذكاء الاصطناعي المساعدة في المبيعات؟" },
        answer: { en: "AI can help write persuasive scripts and find customer pain points.", ar: "يمكنه المساعدة في كتابة سيناريوهات مقنعة وإيجاد نقاط ألم العميل." }
      }
    ],
    recommendedTools: [
      {
        name: "Jasper AI",
        description: { en: "Premium marketing copywriter.", ar: "كاتب محتوى تسويقي متميز." },
        pros: { en: ["Over 50 templates", "Brand voice support"], ar: ["أكثر من 50 قالب", "يدعم نبرة العلامة التجارية"] },
        cons: { en: ["Relatively expensive"], ar: ["غالي الثمن نسبياً"] },
        price: { en: "Starts at $39/mo", ar: "يبدأ من 39$ شهرياً" },
        rating: 4.7,
        affiliateUrl: "https://jasper.ai/?partner=aibridge",
        link: "https://jasper.ai",
        badge: { en: "ROI Champion", ar: "أفضل قيمة استثمارية" }
      }
    ],
    smartAnalysis: {
      en: "Small business owners often face the 'blank page' problem in marketing. AI removes this friction by generating professional-grade copy and strategic insights instantly, allowing small teams to produce output that rivals major competitors with unlimited budgets.",
      ar: "غالباً ما يواجه أصحاب المشاريع الصغيرة 'مشكلة الصفحة البيضاء' في التسويق. يزيل الذكاء الاصطناعي هذا العائق من خلال إنشاء نصوص تسويقية احترافية ورؤى استراتيجية فورية، مما يسمح للفرق الصغيرة بإنتاج مخرجات تضاهي كبار المنافسين ذوي الميزانيات الضخمة."
    },
    seoTitle: {
      en: "AI Marketing Suite for Small Businesses | Emails & Ads Generator",
      ar: "منصة التسويق بالذكاء الاصطناعي لأصحاب المشاريع | إعلانات ورسائل جاهزة"
    },
    seoDescription: {
      en: "Scale your business with AI. Generate professional email campaigns, ad copy, and social media posts without hiring an agency.",
      ar: "كبر مشروعك باستخدام الذكاء الاصطناعي. ولد حملات بريدية ونصوص إعلانية احترافية دون الحاجة لتوظيف وكالة تسويق."
    }
  },
  {
    id: "4",
    slug: "accountant",
    title: { en: "Accountant", ar: "محاسب" },
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
    faqs: [],
    recommendedTools: [],
    smartAnalysis: {
      en: "Accounting is shifting from data entry to data interpretation. AI handles the precision-heavy tasks like categorization and anomaly detection, freeing accountants to provide high-level strategic advisory services that drive business growth.",
      ar: "تتحول المحاسبة من 'إدخال البيانات' إلى 'تفسير البيانات'. يتكفل الذكاء الاصطناعي بالمهام التي تتطلب دقة عالية مثل التصنيف واكتشاف الشواذ، مما يفرغ المحاسب لتقديم خدمات استشارية استراتيجية عالية المستوى تدفع نمو الأعمال."
    }
  },
  {
    id: "5",
    slug: "lawyer",
    title: { en: "Lawyer", ar: "محامٍ" },
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
    faqs: [],
    recommendedTools: [],
    smartAnalysis: {
      en: "In the legal field, time is literally money. AI-driven research and document synthesis allow lawyers to process mountains of case law in minutes, ensuring no detail is missed while significantly reducing the time-to-delivery for complex legal opinions.",
      ar: "في المجال القانوني، الوقت هو المال بالمعنى الحرفي. تتيح الأبحاث وتلخيص الوثائق المدعومة بالذكاء الاصطناعي للمحامين معالجة جبال من السوابق القضائية في دقائق، مما يضمن عدم إغفال أي تفاصيل مع تقليل الوقت المستغرق لتقديم الآراء القانونية المعقدة بشكل كبير."
    }
  },
];
