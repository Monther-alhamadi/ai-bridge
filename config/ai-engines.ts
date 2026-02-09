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
    matchingCount?: number;
    locale?: string;
    
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
        const isAr = p.language === 'ar' || p.locale === 'ar';
        const prompt = isAr
            ? `أنت خبير تقييم أكاديمي ومخطط مناهج محترف (Senior Assessment Designer).
المهمة: بناء اختبار أكاديمي متكامل واحترافي.

**قواعد العمل الصارمة (STRICT RULES):**
1. **الالتزام بالعدد:** يجب توليد العدد المطلوب بالضبط لكل نوع. لا تزد ولا تنقص حبة واحدة.
2. **التصنيف (Grouping):** يجب وضع كل نوع من الأسئلة في 'section' منفصل تماماً. 
3. **المصدر:** ${p.context ? `حصرياً من هذا النص: """${p.context}"""` : `الموضوع العام: ${p.topic}`}

**الأعداد المطلوبة (Mandatory Counts):**
- اختيار من متعدد (MCQ): ${p.mcqCount || 0}
- صح/خطأ: ${p.trueFalseCount || 0}
- مقالي (Essay): ${p.essayCount || 0}
- إكمال فراغ (Blanks): ${p.fillBlanksCount || 0}
- توصيل (Matching): ${p.matchingCount || 0}

**تنسيق البيانات لكل نوع:**
- **التوصيل (Matching):** يجب أن يحتوي الكائن على 'matchingPairs' وهي مصفوفة من { sideA: "البند", sideB: "الإجابة المقابلة" }.
- **إكمال الفراغ:** ضع شرائط (_) مكان الكلمة المفقودة في النص 'text'.

**هيكل JSON (إلزامي):**
{
  "examTitle": "عنوان الاختبار",
  "sections": [
    {
      "sectionTitle": "مثال: الجزء الأول: الاختيار من متعدد",
      "instructions": "تعليمات الحل لهذا القسم...",
      "questions": [
        { "text": "السؤال", "type": "MCQ|True/False|Essay|Blanks|Matching", "options": ["اختيار1", "اختيار2"], "points": 1, "matchingPairs": [...] }
      ]
    }
  ],
  "markingScheme": { ... },
  "taxonomyMatrix": { ... }
}

**تحذير:** إذا طلبت 0 من نوع معين، لا تقم بإنشاء قسم له إطلاقاً.`
            : `Role: Senior Educational Assessment Specialist.
Task: Construct a high-stakes professional academic exam.

**STRICT ADHERENCE PROTOCOL:**
1. **Zero Tolerance Counts:** You MUST generate EXACTLY the numbers requested below. No more, no less.
2. **Strict Grouping:** Questions MUST be grouped into sections by type. Never mix MCQs with Essays.
3. **Context focus:** ${p.context ? `PRIMARY SOURCE: """${p.context}"""` : `Topic: ${p.topic}`}

**REQUIRED QUANTITIES:**
- MCQs: ${p.mcqCount || 0}
- True/False: ${p.trueFalseCount || 0}
- Essay: ${p.essayCount || 0}
- Fill-in-blanks: ${p.fillBlanksCount || 0}
- Matching: ${p.matchingCount || 0}

**DATA FORMATS:**
- **Matching:** Include 'matchingPairs' array: [{ "sideA": "Term", "sideB": "Definition" }].
- **Fill-in-blanks:** Use underscores (____) for missing words in the 'text' field.

**MANDATORY JSON STRUCTURE:**
{
  "examTitle": "Exam Title",
  "sections": [
    {
      "sectionTitle": "Section X: [Type Name]",
      "instructions": "Specific instructions for this type...",
      "questions": [
        { "text": "Question Text", "type": "MCQ|True/False|Essay|Blanks|Matching", "options": [], "points": 1, "matchingPairs": [] }
      ]
    }
  ],
  "markingScheme": { "answers": [] },
  "taxonomyMatrix": { "remember": 0, "understand": 0, ... }
}

**ERROR PREVENTION:** If a quantity is 0, OMIT that entire section from the output.`;
        return prompt;
    },

    "lesson-planner": (p: EngineContext) => {
        const isAr = p.language === 'ar' || p.locale === 'ar';
        return isAr
            ? `أنت خبير تربوي ومخطط مناهج معتمد.
**اللغة:** يجب أن تكون كامل الإجابة باللغة العربية الفصحى الاحترافية.
**المهمة:** تصميم خطة درس إبداعية للمادة: ${p.subject}، الصف: ${p.grade}.

**استراتيجية العمل:**
1. **المصدر الأساسي:** اعتمد كلياً على سياق الكتاب المدرسي المرفق: """${p.context || 'لا يوجد سياق متوفر'}"""
2. **المصدر الإثرائي:** استخدم ذكاءك التربوي لإضافة أنشطة تفاعلية، استراتيجيات تعلم نشط، وربط الدرس بالواقع (AI Knowledge).
3. **الهدف:** دمج دقة المنهج الدراسي مع ابتكار التكنولوجيا الحديثة.

**المواصفات:**
- الزمن الكلي: ${p.duration} دقيقة.
- الأهداف: ${p.objectives}.
- الاستراتيجيات: ${p.strategies?.join('، ') || 'التعلم النشط'}.

**المخرجات (JSON فقط):**
المفاتيح المطلوبة: 'title', 'topic', 'objectives', 'materialsNeeded', 'timeline', 'assessment'.`
            : `Role: Senior Curriculum Architect.
Language: English.
Task: Design a creative lesson plan for ${p.subject}, Grade: ${p.grade}.

Strategy:
1. Primary Source: Use the provided textbook context: """${p.context}"""
2. Secondary Source: Enrich with advanced pedagogical activities and real-world links.
3. Mix: Blend textbook accuracy with AI creativity.

Details:
- Duration: ${p.duration} min
- Objectives: ${p.objectives}

Output:
Strict JSON with: 'title', 'topic', 'objectives', 'materialsNeeded', 'timeline', 'assessment'.`;
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
    },

    "book-indexer": (p: EngineContext) => {
        return p.language === 'ar'
            ? `الدور: خبير في هيكلة المناهج التعليمية وتحليل النصوص المستخرجة عبر OCR.
               المهمة: استخراج "فهرس محتويات" دقيق وشامل من النص التالي المأخوذ من صفحات الفهرس في كتاب (${p.subject}).
               
               النص الخام (قد يحتوي على أخطاء من معالج الصور OCR):
               """${p.context}"""
               
               المتطلبات:
               1. تحديد الوحدات (Units)، الفصول (Chapters)، والدروس (Lessons).
               2. تجاهل أرقام الصفحات العشوائية أو النصوص الجانبية غير المفيدة.
               3. المخرجات يجب أن تكون JSON كائن واحد يحتوي على:
                  - 'summary': مخلص تعليمي للكتاب (فقرة قصيرة).
                  - 'chapters': مصفوفة من الكائنات، كل كائن له: { "title": "العنوان الفعلي للدرس أو الفصل", "type": "unit|chapter|lesson", "page": رقم الصفحة إن وجد }
                  - 'grade': الصف الدراسي المكتشف.
               
               ملاحظة: إذا وجدت عنواناً رئيسياً متبوعاً بعنوان فرعي، فقم بدمجهما في عنوان واحد واضح.`
            : `Role: Professional Curriculum Structurist & OCR Post-Processor.
               Task: Extract a precise and comprehensive Table of Contents from the following noisy OCR text for (${p.subject}).
               
               Raw OCR Text:
               """${p.context}"""
               
               Requirements:
               1. Identify Units, Chapters, and Lessons clearly.
               2. Filter out random symbols, page numbers that aren't titles, and noise.
               3. Output MUST be a single JSON object with:
                  - 'summary': Brief educational overview.
                  - 'chapters': Array of objects: { "title": "Real title text", "type": "unit|chapter|lesson", "page": number|null }
                  - 'metadata': Detected grade/target audience.
               
               Note: Combine main titles and subtitles if they belong together for a single lesson plan.`;
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
