export type EngineContext = {
    // Core Identity
    role: string;
    task: string;
    
    // User Inputs
    topic?: string;
    level?: string;
    language: "en" | "ar";
    
    // Parametric Tools
    difficulty?: number;
    count?: number;
    
    // Exam Engine Specifics
    mcqCount?: number;
    essayCount?: number;
    trueFalseCount?: number;
    fillBlanksCount?: number;
    matchingCount?: number;
    
    // Lesson Planner Specifics
    subject?: string;
    grade?: string;
    objectives?: string;
    strategies?: string[];
    duration?: string;
    
    // File/Context Injection
    context?: string; // The "Magic Button" payload
    
    // Tone/Style
    tone?: string;
    style?: string;

    [key: string]: any;
};

// --- GENERIC LIGHT WEIGHT ENGINES ---
const GENERIC_ENGINES = {
    "caption-generator": (p: EngineContext) => p.language === 'ar' 
        ? `اكتب وصفاً جذاباً للصورة (Caption) حول: ${p.topic}.`
        : `Write a catchy caption about: ${p.topic}.`,
        
    "email-composer": (p: EngineContext) => p.language === 'ar'
        ? `اكتب بريداً إلكترونياً رسمياً حول: ${p.topic}. النبرة: ${p.tone || 'رسمي'}.`
        : `Write a formal email about: ${p.topic}. Tone: ${p.tone || 'formal'}.`
};

// --- DEEP CONTEXT ENGINES (TEACHER OS) ---
const TEACHER_ENGINES = {
    "exam-generator": (p: EngineContext) => {
        const prompt = p.language === 'ar'
            ? `الدور: خبير تقييم تربوي.
               المهمة: بناء اختبار أكاديمي متكامل.
               المصدر: ${p.context ? `استخدم النص التالي كمصدر وحيد للأسئلة: """${p.context}"""` : `الموضوع العام: ${p.topic}`}
               
               المواصفات الفنية:
               - الصعوبة: ${p.difficulty}/5 (Bloom's Taxonomy)
               - اختيار من متعدد: ${p.mcqCount || 0}
               - صح/خطأ: ${p.trueFalseCount || 0}
               - مقالي: ${p.essayCount || 0}
               - إكمال فراغ: ${p.fillBlanksCount || 0}
               - توصيل: ${p.matchingCount || 0}
               
               المخرجات المطلوبة:
               JSON فقط يحتوي على مصفوفة 'questions' وكل سؤال له 'text', 'type', 'options' (للاختيار), 'answer'.`
            : `Role: Educational Assessment Expert.
               Task: Construct a comprehensive academic exam.
               Source: ${p.context ? `Use the following text as the SOLE source: """${p.context}"""` : `General Topic: ${p.topic}`}
               
               Specs:
               - Difficulty: ${p.difficulty}/5
               - MCQs: ${p.mcqCount || 0}
               - True/False: ${p.trueFalseCount || 0}
               - Essay: ${p.essayCount || 0}
               - Blanks: ${p.fillBlanksCount || 0}
               - Matching: ${p.matchingCount || 0}
               
               Output:
               Strict JSON with 'questions' array.`;
        return prompt;
    },

    "lesson-planner": (p: EngineContext) => {
        return p.language === 'ar'
            ? `الدور: مهندس مناهج ذكي.
               المهمة: تصميم خطة درس تفصيلية.
               ${p.context ? `السياق من الكتاب المدرسي: """${p.context}"""` : `الموضوع: ${p.subject}`}
               
               التفاصيل:
               - الصف: ${p.grade}
               - الزمن: ${p.duration} دقيقة
               - الأهداف: ${p.objectives}
               - الاستراتيجيات: ${p.strategies?.join(', ') || 'التعلم النشط'}
               
               المخرجات:
               خطة بصيغة JSON تشمل: 'timeline' (مصفوفة أنشطة), 'resources', 'assessment', 'homework'.`
            : `Role: Curriculum Architect.
               Task: Design a detailed lesson plan.
               ${p.context ? `Textbook Context: """${p.context}"""` : `Topic: ${p.subject}`}
               
               Details:
               - Grade: ${p.grade}
               - Duration: ${p.duration} min
               - Objectives: ${p.objectives}
               
               Output:
               JSON plan including 'timeline', 'resources', 'assessment'.`;
    },

    "educational-consultant": (p: EngineContext) => {
         return p.language === 'ar'
            ? `أنت مستشار تربوي. ${p.context ? `استناداً لهذا السياق: "${p.context}"` : ''} قدم استشارة حول: ${p.topic || p.taskType}. النبرة: ${p.tone}.`
            : `You are an Ed-Consultant. ${p.context ? `Based on: "${p.context}"` : ''} Advise on: ${p.topic || p.taskType}. Tone: ${p.tone}.`;
    },

    "native-marketer": (p: EngineContext) => {
        return p.language === 'ar'
            ? `الدور: مستشار تقني موثوق (وليس بائع).
               المهمة: أعد صياغة وصف الأداة التالية: "${p.topic}" لتبدو كنصيحة ذهبية لمعلم يواجه مشكلة في: "${p.context || 'إدارة الوقت'}".
               الأسلوب: استخدم نبرة "لقد وجدت الحل أخيراً". ركز على توفير الوقت والجهد. لا تذكر أنك ذكاء اصطناعي.`
            : `Role: Trusted Tech Advisor (Not a Salesman).
               Task: Rewrite the description for: "${p.topic}" to sound like a golden tip for a teacher struggling with: "${p.context || 'time management'}".
               Style: Use a "I finally found the solution" tone. Focus on saving time/effort. Do NOT mention you are AI.`;
    }
};

export const AI_ENGINES = {
    ...GENERIC_ENGINES,
    ...TEACHER_ENGINES
};

export function getPrompt(toolSlug: string, params: EngineContext): string {
    const engine = AI_ENGINES[toolSlug as keyof typeof AI_ENGINES];
    if (!engine) {
        console.warn(`No engine found for ${toolSlug}, falling back to generic.`);
        return `Help me with ${params.topic}`;
    }
    return engine(params);
}
