export type ToolPromptParams = {
  topic?: string;
  difficulty?: number;
  count?: number;
  mcqCount?: number;
  essayCount?: number;
  trueFalseCount?: number;
  fillBlanksCount?: number;
  matchingCount?: number;
  level?: string;
  context?: string;
  language: "en" | "ar";
  taskType?: string; // e.g., 'letter', 'behavior', 'project'
  tone?: string; // e.g., 'formal', 'friendly', 'firm'
  // Lesson Planner specific
  subject?: string;
  grade?: string;
  objectives?: string;
  strategies?: string[];
  duration?: string;
  // Printing / Branding
  schoolName?: string;
  teacherName?: string;
  logoAttached?: boolean;

  [key: string]: any; // Index signature for dynamic tool parameters
};

export const PROMPT_FACTORY = {
  teacher: {
    "exam-generator": (params: ToolPromptParams) => {
      const { topic, difficulty, mcqCount, essayCount, trueFalseCount, fillBlanksCount, matchingCount, language, context } = params;
      return language === "ar" 
        ? `أنت خبير تربوي ومصمم اختبارات محترف. 
           المهمة: قم بإنشاء اختبار احترافي بناءً على المعايير التالية:
           - الموضوع/النص الأساسي: ${topic}
           - مستوى الصعوبة: ${difficulty}% (حيث 0 سهل و 100 صعب جداً)
           - عدد أسئلة الاختيار من متعدد (MCQ): ${mcqCount || 0}
           - عدد أسئلة (صح/خطأ): ${trueFalseCount || 0}
           - عدد الأسئلة المقالية: ${essayCount || 0}
           - عدد أسئلة (إكمال الفراغ): ${fillBlanksCount || 0}
           - عدد أسئلة (التوصيل/المزاوجة): ${matchingCount || 0}
           - سياق إضافي من الملف المرفق: ${context || "لا يوجد"}
           
           شروط المخرجات:
           1. التزم بدقة بالأعداد المطلوبة. إذا كان العدد 0 لأي نوع، فلا تقم بإنشائه.
           2. نسق الاختبار بشكل جمالي ومنظم.
           3. أضف مفتاح الإجابات في النهاية بشكل منفصل.`
        : `Act as a professional educational consultant and assessment designer. 
           Task: Create a professional exam based on these parameters:
           - Topic/Source Text: ${topic}
           - Difficulty Level: ${difficulty}% (0 is easy, 100 is very hard)
           - MCQ Question Count: ${mcqCount || 0}
           - True/False Question Count: ${trueFalseCount || 0}
           - Essay Question Count: ${essayCount || 0}
           - Fill in the Blanks Count: ${fillBlanksCount || 0}
           - Matching Questions Count: ${matchingCount || 0}
           - Context from uploaded file: ${context || "None"}
           
           Output requirements:
           1. Strictly adhere to the requested question counts. If a count is 0, do not include that section.
           2. Format the exam beautifully and professionally.
           3. Include a separate answer key at the end.`;
    },
    "lesson-planner": (params: ToolPromptParams) => {
        const { subject, grade, objectives, strategies, duration, language } = params;
        const strategiesList = strategies ? strategies.join(', ') : '';
        return language === "ar"
          ? `أنت مخطط دروس ذكي. أنشئ خطة درس للموضوع: ${subject} للصف: ${grade}.
              أهداف التعلم: ${objectives}.
              استراتيجيات التدريس: ${strategiesList}.
              مدة الحصة: ${duration} دقيقة.
              تشمل الخطة وسائل تعليمية، جدول زمني مفصل، وتقييم نهائي.`
          : `You are a Smart Lesson Planner. Create a lesson plan for subject: ${subject}, grade: ${grade}.
              Learning objectives: ${objectives}.
              Teaching strategies: ${strategiesList}.
              Duration: ${duration} minutes.
              Include teaching aids, a detailed timeline, and a final assessment.`;
    },
    "career-assistant": (params: ToolPromptParams) => {
        const { topic, level, language } = params;
        return language === "ar"
          ? `أنت مساعد مهني ذكي للمعلمين. ساعدني في تحسين آدائي في: ${topic}. 
             المستهدف: ${level}. اقدم نصائح عملية، استراتيجيات إدارة صف، وتقنيات تعامل مع الطلاب.`
          : `Act as a Smart Career Assistant for Teachers. Help me improve my performance in: ${topic}. 
             Target: ${level}. Provide practical tips, classroom management strategies, and student engagement techniques.`;
    },
    "smart-consultant": (params: ToolPromptParams) => {
        const { topic, language } = params;
        return language === "ar"
          ? `أنت مستشار استراتيجي في التطوير التربوي. قدم لي استشارة معمقة حول ملف: ${topic}. 
             حلل التحديات، اقترح حلولاً مبتكرة، وارسم خريطة طريق للتطوير.`
          : `Act as a Strategic Educational Development Consultant. Provide an in-depth consultation on: ${topic}. 
             Analyze challenges, suggest innovative solutions, and draft a development roadmap.`;
    },
    "educational-consultant": (params: ToolPromptParams) => {
        const { taskType, tone, language } = params;
        const taskDesc = taskType ? taskType : 'general assistance';
        const toneDesc = tone ? tone : 'neutral';
        return language === "ar"
          ? `أنت مستشار تربوي خبير. مهمتك: ${taskDesc} بنبرة ${toneDesc}. قدم نصاً جاهزاً للنسخ أو الإرسال عبر البريد الإلكتروني.`
          : `You are an expert Educational Consultant. Your task: ${taskDesc} with a ${toneDesc} tone. Provide ready-to-copy text for email or direct use.`;
    }
  },
  "content-creator": {
    "script-writer": (params: ToolPromptParams) => {
        const { topic, language } = params;
        return language === "ar"
          ? `أنت كاتب سيناريو فيديوهات قصيرة (Reels/TikTok) محترف. اكتب سيناريو فيروسي حول: ${topic}. 
             ركز على Hook خاطف في أول 3 ثوانٍ، محتوى قيمي، ودعوة صريحة للفعل (CTA).`
          : `Act as a professional viral scriptwriter for short-form video (TikTok/Reels). Write a viral script for: ${topic}. 
             Focus on a 3-second hook, high-value body content, and a clear CTA.`;
    },
    "career-assistant": (params: ToolPromptParams) => {
        const { topic, language } = params;
        return language === "ar"
          ? `أنت مساعد مهني لصناع المحتوى. ساعدني في بناء علامتي التجارية الشخصية حول: ${topic}. 
             اقترح استراتيجيات نمو، أفكار لمنشورات، وطرق لزيادة التفاعل.`
          : `Act as a Career Assistant for Content Creators. Help me build my personal brand around: ${topic}. 
             Suggest growth strategies, content pillars, and ways to increase engagement.`;
    }
  },
  "business-owner": {
    "smart-consultant": (params: ToolPromptParams) => {
        const { topic, language } = params;
        return language === "ar"
          ? `أنت مستشار أعمال خبير. قدم لي تحليلاً لاستراتيجية: ${topic}. 
             ركز على نموذج الربحية، كفاءة العمليات، وتوقعات النمو.`
          : `Act as an expert Business Consultant. Analyze the strategy for: ${topic}. 
             Focus on the business model, operational efficiency, and growth projections.`;
    }
  }
};
