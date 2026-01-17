"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  CalendarDays, 
  FileText, 
  ClipboardList, 
  Sparkles, 
  Library, 
  Settings, 
  ArrowLeft,
  Download,
  Upload,
  Database
} from "lucide-react";
import { useActiveLesson } from "@/lib/hooks/use-active-lesson";
import { useBackup } from "@/lib/hooks/use-backup";
import { toast } from "react-hot-toast";
import { AffiliateCard } from "@/components/AffiliateCard";

interface SidebarProps {
  locale: "en" | "ar";
}

export function TeacherSidebar({ locale }: SidebarProps) {
  const pathname = usePathname();
  const activeLesson = useActiveLesson();
  const { exportData, importData } = useBackup();
  
  const isRTL = locale === 'ar';
  
  const handleBackup = async () => {
     const ok = await exportData();
     if(ok) toast.success(locale === 'ar' ? 'تم تصدير نسخة احتياطية' : 'Backup exported successfully');
     else toast.error(locale === 'ar' ? 'فشل التصدير' : 'Export failed');
  };

  const handleRestore = () => {
     const input = document.createElement('input');
     input.type = 'file';
     input.accept = '.json';
     input.onchange = async (e) => {
        const f = (e.target as HTMLInputElement).files?.[0];
        if(!f) return;
        try {
            await importData(f);
            toast.success(locale === 'ar' ? 'تم استعادة البيانات' : 'Data restored successfully');
            window.location.reload(); // Refresh to show data
        } catch(err) {
            toast.error(locale === 'ar' ? 'ملف غير صالح' : 'Invalid file');
        }
     };
     input.click();
  };

  const isActive = (path: string) => pathname.includes(path);

  const MENUS = [
    {
        title: { en: "The Pulse", ar: "نبض اليوم" },
        items: [
            {
                label: { en: activeLesson ? "Today's Lesson" : "No Lesson Today", ar: activeLesson ? "درس اليوم" : "لا يوجد درس" },
                href: "/tools/teacher/schedule", // Or detailed view
                icon: CalendarDays,
                highlight: !!activeLesson
            },
            {
                label: { en: "Quick Prep", ar: "تحضير سريع" },
                href: "/tools/teacher/lesson-planner",
                icon: Sparkles
            }
        ]
    },
    {
        title: { en: "The Arsenal", ar: "الترسانة" },
        items: [
            {
                label: { en: "Exam Gen", ar: "مولد الاختبارات" },
                href: "/tools/teacher/exam-generator",
                icon: FileText
            },
            {
                label: { en: "Lesson Planner", ar: "مخطط الدروس" },
                href: "/tools/teacher/lesson-planner",
                icon: ClipboardList
            },
            {
                label: { en: "Activity Bank", ar: "بنك الأنشطة" },
                href: "/tools/teacher/educational-consultant",
                icon: Library // Using library icon for now
            }
        ]
    },
    {
        title: { en: "The Archive", ar: "الأرشيف" },
        items: [
            {
                label: { en: "My Books", ar: "كتبي" },
                href: "/tools/teacher/books", // Future route
                icon: Library
            }
        ]
    }
  ];

  return (
    <aside className={cn(
        "w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col border-r border-slate-800",
        isRTL ? "border-l border-r-0" : ""
    )}>
        {/* Brand */}
        <div className="p-6">
            <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                <span className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">OS</span>
                TEACHER
            </h1>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 space-y-8">
            {MENUS.map((section, idx) => (
                <div key={idx}>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">
                        {section.title[locale]}
                    </h3>
                    <div className="space-y-1">
                        {section.items.map((item, i) => (
                            <Link 
                                key={i} 
                                href={`/${locale}${item.href}`}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm",
                                    isActive(item.href) 
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                                        : "hover:bg-slate-800 hover:text-white",
                                    item.highlight ? "animate-pulse border border-blue-500/50" : ""
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    isActive(item.href) ? "text-white" : "text-slate-500 group-hover:text-white"
                                )} />
                                {item.label[locale]}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Tool Recommendation Card */}
        <div className="px-4 py-4">
           <AffiliateCard toolId="gamma" locale={locale} variant="compact" className="bg-slate-800/50 border-slate-700/50" />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
            
            {/* Data Controls */}
            <div className="flex gap-2 mb-2">
                <button 
                    onClick={handleBackup}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    title={locale === 'en' ? "Back up Data" : "نسخ احتياطي"}
                >
                    <Download className="w-3 h-3" />
                    {locale === 'en' ? "Backup" : "نسخ"}
                </button>
                <button 
                    onClick={handleRestore}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                     title={locale === 'en' ? "Restore Data" : "استعادة"}
                >
                    <Upload className="w-3 h-3" />
                    {locale === 'en' ? "Restore" : "استعادة"}
                </button>
            </div>

            <Link 
                href={`/${locale}`}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm font-bold"
            >
                <ArrowLeft className={cn("w-5 h-5", isRTL ? "rotate-180" : "")} />
                {locale === 'en' ? "Change Profession" : "تغيير المهنة"}
            </Link>
        </div>
    </aside>
  );
}
