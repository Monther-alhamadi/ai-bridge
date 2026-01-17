export interface AffiliateTool {
    id: string;
    name: string;
    defaultLink: string;
    description: { en: string; ar: string };
    coupon?: string;
    discount?: string;
}

// Mock Database of Affiliate Tools (Supabase Replacement)
const AFFILIATE_TOOLS: Record<string, AffiliateTool> = {
    // === PRESENTATION & DESIGN ===
    "canva": {
        id: "canva",
        name: "Canva for Education",
        defaultLink: "https://www.canva.com/education/",
        description: { 
            en: "Design beautiful worksheets, presentations, and infographics in minutes—no design skills needed.",
            ar: "صمم أوراق عمل وعروض تقديمية ورسوم بيانية احترافية في دقائق—دون الحاجة لمهارات تصميم."
        },
        discount: "Free for Teachers"
    },
    "gamma": {
        id: "gamma",
        name: "Gamma App",
        defaultLink: "https://gamma.app/",
        description: {
            en: "Generate stunning presentations from your lesson plans using AI. No more PowerPoint headaches.",
            ar: "حوّل خططك الدرسية إلى عروض تقديمية مذهلة بالذكاء الاصطناعي. لا مزيد من صداع البوربوينت."
        },
        coupon: "TEACHAI20"
    },
    
    // === ORGANIZATION & PRODUCTIVITY ===
    "notion": {
        id: "notion",
        name: "Notion",
        defaultLink: "https://www.notion.so/",
        description: {
            en: "Your all-in-one workspace. Organize lesson plans, track student progress, and manage your entire teaching life.",
            ar: "مساحة العمل الشاملة. نظم خططك الدرسية، تابع تقدم الطلاب، وأدر حياتك المهنية بالكامل."
        }
    },
    "trello": {
        id: "trello",
        name: "Trello",
        defaultLink: "https://trello.com/",
        description: {
            en: "Visual project management for classroom activities. Track assignments, projects, and deadlines effortlessly.",
            ar: "إدارة مرئية للأنشطة الصفية. تتبع الواجبات والمشاريع والمواعيد النهائية بسهولة."
        }
    },
    
    // === ASSESSMENT & GAMIFICATION ===
    "quizizz": {
        id: "quizizz",
        name: "Quizizz",
        defaultLink: "https://quizizz.com/",
        description: {
            en: "Gamified quizzes that engage every student. Turn your AI-generated exams into interactive competitions.",
            ar: "اختبارات تفاعلية ممتعة تجذب كل طالب. حوّل اختباراتك المُولدة بالذكاء الاصطناعي إلى منافسات تفاعلية."
        }
    },
    "kahoot": {
        id: "kahoot",
        name: "Kahoot!",
        defaultLink: "https://kahoot.com/",
        description: {
            en: "Make learning awesome with game-based assessments. Perfect for review sessions before exams.",
            ar: "اجعل التعلم ممتعاً مع التقييمات القائمة على الألعاب. مثالي لجلسات المراجعة قبل الاختبارات."
        }
    },
    
    // === VIDEO & INTERACTION ===
    "loom": {
        id: "loom",
        name: "Loom",
        defaultLink: "https://www.loom.com/education",
        description: {
            en: "Record quick video lessons and explanations. Great for flipped classrooms and asynchronous learning.",
            ar: "سجل دروس فيديو سريعة وشروحات. رائع للفصول المقلوبة والتعلم غير المتزامن."
        },
        discount: "Free for Educators"
    },
    "edpuzzle": {
        id: "edpuzzle",
        name: "Edpuzzle",
        defaultLink: "https://edpuzzle.com/",
        description: {
            en: "Transform any video into an interactive lesson with embedded questions and analytics.",
            ar: "حوّل أي فيديو إلى درس تفاعلي مع أسئلة مدمجة وتحليلات."
        }
    },
    
    // === AI WRITING & GRADING ===
    "grammarly": {
        id: "grammarly",
        name: "Grammarly for Education",
        defaultLink: "https://www.grammarly.com/edu",
        description: {
            en: "Help students improve their writing with AI-powered feedback. Save hours on grading essays.",
            ar: "ساعد الطلاب على تحسين كتابتهم بملاحظات مدعومة بالذكاء الاصطناعي. وفّر ساعات من تصحيح المقالات."
        }
    },
    "turnitin": {
        id: "turnitin",
        name: "Turnitin",
        defaultLink: "https://www.turnitin.com/",
        description: {
            en: "Ensure academic integrity with plagiarism detection. Essential for maintaining standards.",
            ar: "ضمان النزاهة الأكاديمية باكتشاف الانتحال. ضروري للحفاظ على المعايير."
        }
    },
    
    // === COLLABORATION ===
    "miro": {
        id: "miro",
        name: "Miro",
        defaultLink: "https://miro.com/education/",
        description: {
            en: "Digital whiteboard for brainstorming and collaborative activities. Perfect for group projects.",
            ar: "سبورة رقمية للعصف الذهني والأنشطة التعاونية. مثالي للمشاريع الجماعية."
        },
        discount: "Free for Educators"
    },
    "padlet": {
        id: "padlet",
        name: "Padlet",
        defaultLink: "https://padlet.com/",
        description: {
            en: "Create beautiful boards for student collaboration and idea sharing in seconds.",
            ar: "أنشئ لوحات جميلة للتعاون بين الطلاب ومشاركة الأفكار في ثوانٍ."
        }
    },
    
    // === SCHEDULING & COMMUNICATION ===
    "calendly": {
        id: "calendly",
        name: "Calendly",
        defaultLink: "https://calendly.com/",
        description: {
            en: "Schedule parent-teacher meetings without the email back-and-forth. Simple and professional.",
            ar: "جدولة اجتماعات أولياء الأمور دون الرسائل المتبادلة. بسيط واحترافي."
        }
    },
    "classدojo": {
        id: "classdojo",
        name: "ClassDojo",
        defaultLink: "https://www.classdojo.com/",
        description: {
            en: "Connect with parents and build a positive classroom culture with behavior tracking.",
            ar: "تواصل مع أولياء الأمور وابنِ ثقافة صفية إيجابية من خلال تتبع السلوك."
        }
    },
    
    // === STORAGE & BACKUP ===
    "google-workspace": {
        id: "google-workspace",
        name: "Google Workspace for Education",
        defaultLink: "https://edu.google.com/workspace-for-education/",
        description: {
            en: "Unlimited storage, collaboration tools, and security—all free for schools.",
            ar: "تخزين غير محدود، أدوات تعاون، وأمان—كلها مجانية للمدارس."
        },
        discount: "Free"
    }
};

export const AffiliateManager = {
    getLink: (toolId: string): string => {
        const tool = AFFILIATE_TOOLS[toolId];
        return tool ? tool.defaultLink : '#';
    },

    getTool: (toolId: string): AffiliateTool | null => {
        return AFFILIATE_TOOLS[toolId] || null;
    },

    getAllTools: (): AffiliateTool[] => {
        return Object.values(AFFILIATE_TOOLS);
    },

    getToolsByCategory: (category: 'presentation' | 'productivity' | 'assessment' | 'video' | 'ai' | 'collaboration' | 'communication' | 'storage'): AffiliateTool[] => {
        const categoryMap: Record<string, string[]> = {
            presentation: ['canva', 'gamma'],
            productivity: ['notion', 'trello'],
            assessment: ['quizizz', 'kahoot'],
            video: ['loom', 'edpuzzle'],
            ai: ['grammarly', 'turnitin'],
            collaboration: ['miro', 'padlet'],
            communication: ['calendly', 'classdojo'],
            storage: ['google-workspace']
        };
        
        const ids = categoryMap[category] || [];
        return ids.map(id => AFFILIATE_TOOLS[id]).filter(Boolean);
    }
};
