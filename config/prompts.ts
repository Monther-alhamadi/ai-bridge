export type ToolPromptParams = {
  topic?: string;
  difficulty?: number;
  count?: number;
  mcqCount?: number;
  essayCount?: number;
  level?: string;
  context?: string;
  language: "en" | "ar";
};

export const PROMPT_FACTORY = {
  teacher: {
    "exam-generator": (params: ToolPromptParams) => {
      const { topic, difficulty, mcqCount, essayCount, language, context } = params;
      return language === "ar" 
        ? `أنت خبير تربوي ومصمم اختبارات محترف. 
           المهمة: قم بإنشاء اختبار احترافي بناءً على المعايير التالية:
           - الموضوع/النص الأساسي: ${topic}
           - مستوى الصعوبة: ${difficulty}% (حيث 0 سهل و 100 صعب جداً)
           - عدد أسئلة الاختيار من متعدد (MCQ): ${mcqCount}
           - عدد الأسئلة المقالية: ${essayCount}
           - سياق إضافي من الملف المرفق: ${context || "لا يوجد"}
           
           شروط المخرجات:
           1. التزم بدقة بالأعداد المطلوبة.
           2. نسق الاختبار بشكل جمالي ومنظم.
           3. أضف مفتاح الإجابات في النهاية بشكل منفصل.`
        : `Act as a professional educational consultant and assessment designer. 
           Task: Create a professional exam based on these parameters:
           - Topic/Source Text: ${topic}
           - Difficulty Level: ${difficulty}% (0 is easy, 100 is very hard)
           - MCQ Question Count: ${mcqCount}
           - Essay Question Count: ${essayCount}
           - Context from uploaded file: ${context || "None"}
           
           Output requirements:
           1. Strictly adhere to the requested question counts.
           2. Format the exam beautifully and professionally.
           3. Include a separate answer key at the end.`;
    },
    "lesson-planner": (params: ToolPromptParams) => {
        const { topic, level, language } = params;
        return language === "ar"
          ? `أنت مستشار تعليمي أول. قم بإعداد خطة درس شاملة لموضوع: ${topic} للمستوى: ${level}. 
             يجب أن تشمل الخطة: الأهداف السلوكية، الوسائل التعليمية، سير الدرس الزمني (45 دقيقة)، وتقويم ختامي.`
          : `Act as a Senior Educational Consultant. Create a comprehensive lesson plan for: ${topic} at level: ${level}. 
             Include: Learning objectives, teaching aids, a 45-minute step-by-step timeline, and a final assessment.`;
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
    }
  }
};
