"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Search, 
  LayoutGrid, 
  Presentation, 
  ClipboardList, 
  GraduationCap, 
  Video, 
  BrainCircuit, 
  Users2, 
  MessageSquare,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AffiliateManager } from "@/lib/affiliate-manager";
import { AffiliateCard } from "@/components/AffiliateCard";

type Category = 'all' | 'presentation' | 'productivity' | 'assessment' | 'video' | 'ai' | 'collaboration' | 'communication' | 'storage';

export default function ToolkitPage() {
  const params = useParams();
  const locale = params.locale as "ar" | "en";
  const isRTL = locale === "ar";
  
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: 'all' as Category, label: { en: "All Tools", ar: "كل الأدوات" }, icon: LayoutGrid },
    { id: 'presentation' as Category, label: { en: "Presentations", ar: "العروض التقديمية" }, icon: Presentation },
    { id: 'productivity' as Category, label: { en: "Productivity", ar: "الإنتاجية" }, icon: ClipboardList },
    { id: 'assessment' as Category, label: { en: "Assessments", ar: "التقييمات" }, icon: GraduationCap },
    { id: 'ai' as Category, label: { en: "AI Writing", ar: "الكتابة بالذكاء" }, icon: BrainCircuit },
    { id: 'video' as Category, label: { en: "Video", ar: "الفيديو" }, icon: Video },
    { id: 'collaboration' as Category, label: { en: "Collaboration", ar: "التعاون" }, icon: Users2 },
    { id: 'communication' as Category, label: { en: "Communication", ar: "التواصل" }, icon: MessageSquare },
    { id: 'storage' as Category, label: { en: "Storage", ar: "التخزين" }, icon: HardDrive },
  ];

  const filteredTools = useMemo(() => {
    let tools = activeCategory === 'all' 
      ? AffiliateManager.getAllTools() 
      : AffiliateManager.getToolsByCategory(activeCategory);
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tools = tools.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.description[locale].toLowerCase().includes(q)
      );
    }
    
    return tools;
  }, [activeCategory, searchQuery, locale]);

  const content = {
    en: {
      title: "Elite Toolkit",
      subtitle: "The Ultimate Guide to AI in Education",
      description: "Handpicked tools to help you teach smarter, save time, and engage 21st-century students.",
      searchPlaceholder: "Search for a tool...",
      noResults: "No tools found matching your search.",
      filterTitle: "Categories"
    },
    ar: {
      title: "حقيبة الأدوات",
      subtitle: "دليلك الشامل للذكاء الاصطناعي في التعليم",
      description: "أدوات مختارة بعناية لمساعدتك على التدريس بذكاء، توفير الوقت، وجذب طلاب القرن الحادي والعشرين.",
      searchPlaceholder: "ابحث عن أداة...",
      noResults: "لم يتم العثور على أدوات تطابق بحثك.",
      filterTitle: "التصنيفات"
    }
  };

  const t = content[locale] || content.en;

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Premium Header */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="container max-w-6xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-black uppercase tracking-widest"
          >
            <Sparkles className="h-4 w-4" />
            {t.subtitle}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl font-black font-cairo"
          >
            <span className="bg-gradient-to-r from-slate-900 via-primary to-blue-600 bg-clip-text text-transparent dark:from-white">
              {t.title}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t.description}
          </motion.p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="space-y-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-4 focus:ring-2 focus:ring-primary/50 transition-all",
                  isRTL ? "pr-12" : "pl-12"
                )}
              />
            </div>

            <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-[2rem] p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-6 px-2">
                {t.filterTitle}
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm",
                      activeCategory === cat.id 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                    )}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.label[locale]}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Tools Grid */}
          <main>
            <AnimatePresence mode="popLayout">
              <motion.div 
                layout
                className="grid md:grid-cols-2 gap-6"
              >
                {filteredTools.map((tool) => (
                  <AffiliateCard 
                    key={tool.id} 
                    toolId={tool.id} 
                    locale={locale} 
                    className="h-full"
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredTools.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="h-20 w-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <p className="text-muted-foreground font-bold">{t.noResults}</p>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
