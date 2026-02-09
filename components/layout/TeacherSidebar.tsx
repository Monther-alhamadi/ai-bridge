"use client";
import React, { useState, useEffect } from "react";

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
  Database,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  CreditCard,
  Zap
} from "lucide-react";
import { useActiveLesson } from "@/lib/hooks/use-active-lesson";
import { useBackup } from "@/lib/hooks/use-backup";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { AffiliateCard } from "@/components/AffiliateCard";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { NotificationCenter } from "./NotificationCenter";
import { Bell, Monitor, LogOut, User, LogIn } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/use-auth";

interface SidebarProps {
  locale: "en" | "ar";
}

export function TeacherSidebar({ locale }: SidebarProps) {
  const pathname = usePathname();
  const activeLesson = useActiveLesson();
  const { exportData, importData } = useBackup();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const isRTL = locale === 'ar';

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };
  
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

  // Phase 46: Smart Assistant Logic for Upcoming Lesson
  const upcomingLessons = useLiveQuery(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return db.lessons
      .where('date')
      .aboveOrEqual(today)
      .filter(l => l.status === 'pending' || l.status === 'planned')
      .toArray();
  }, []);

  const nextLesson = upcomingLessons?.sort((a,b) => a.date.getTime() - b.date.getTime())[0];

  interface MenuItem {
    label: { en: string; ar: string };
    href: string;
    icon: any;
    highlight?: boolean;
    className?: string;
  }

  const MENUS: { title: { en: string; ar: string }; items: MenuItem[] }[] = [
    {
        title: { en: "Navigation", ar: "التنقل" },
        items: [
            {
                label: { en: "Main Hub", ar: "الرئيسية (جسر الذكاء)" },
                href: "/",
                icon: Home,
                className: "text-blue-400 hover:text-blue-300 font-bold border-b border-slate-800 pb-4 mb-4 rounded-none h-auto"
            }
        ]
    },
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
                label: { en: "My Subjects", ar: "كتبي وموادي" },
                href: "/tools/teacher/subjects",
                icon: Database
            }
        ]
    }
  ];

  return (
    <>
      {/* Mobile Toggle Trigger */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-slate-900 text-white rounded-xl shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm" 
            onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={cn(
        "bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col border-r border-slate-800 transition-all duration-300 z-[70]",
        isRTL ? "border-l border-r-0 left-0" : "right-0",
        isCollapsed ? "w-20" : "w-64",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full"),
        "fixed lg:sticky lg:translate-x-0"
      )}>
        {/* Resize Toggle (Desktop Only) */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
                "hidden lg:flex absolute top-10 -right-3 w-6 h-6 bg-blue-600 text-white rounded-full items-center justify-center border-4 border-slate-900 hover:scale-110 transition-all z-10",
                isRTL && "-left-3 right-auto rotate-180"
            )}
        >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Brand */}
        <div className="relative group/brand">
            <div className="flex items-center justify-between pr-4 pl-4">
                <Link href={`/${locale}`} className={cn("p-6 flex items-center gap-2 hover:opacity-80 transition-opacity overflow-hidden", isCollapsed && "justify-center px-2")}>
                    <div className="bg-blue-600 min-w-[32px] h-8 rounded-lg flex items-center justify-center text-sm font-black text-white shrink-0">OS</div>
                    {!isCollapsed && (
                        <span className="text-xl font-black text-white tracking-tighter whitespace-nowrap uppercase">Teacher Hub</span>
                    )}
                </Link>
                
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowNotifications(true)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all relative"
                        >
                            <Bell size={18} />
                            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
                        </button>
                    </div>
                )}
            </div>
            
            {/* Persona "جسور" (Phase 48) */}
            {!isCollapsed && (
                <div className="mx-6 mb-6 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                            </div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-white tracking-tight uppercase">
                            {locale === 'ar' ? 'جسور (المساعد الذكي)' : 'Josoor (AI Assistant)'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">
                            {locale === 'ar' ? 'متصل وجاهز للمساعدة' : 'Online & ready to help'}
                        </span>
                    </div>
                </div>
            )}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 space-y-8">
            {/* Smart Assistant Countdown (Phase 46) */}
            {!isCollapsed && nextLesson && (
                <div className="mx-2 p-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/5 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                            {locale === 'ar' ? 'الحصة القادمة' : 'Up Next'}
                        </span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">{nextLesson.title}</h4>
                    <div className="flex items-center justify-between mt-2 gap-2">
                        <p className="text-[10px] text-slate-400">
                            {locale === 'ar' ? 'اليوم في ' : 'Today at '} {nextLesson.date.getHours()}:00
                        </p>
                        <Button 
                            size="sm" 
                            onClick={() => router.push(`/${locale}/tools/teacher/lesson-planner?lessonId=${nextLesson.id}&auto=true`)}
                            className="h-6 px-2 text-[10px] bg-blue-600 hover:bg-blue-500 text-white rounded-lg border-none"
                        >
                            <Zap size={10} className="mr-1" />
                            {locale === 'ar' ? 'تحضير' : 'Prep'}
                        </Button>
                    </div>
                </div>
            )}

            {MENUS.map((section, idx) => (
                <div key={idx}>
                    {!isCollapsed && (
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-2">
                            {section.title[locale]}
                        </h3>
                    )}
                    <div className="space-y-1">
                        {section.items.map((item, i) => (
                            <Link 
                                key={i} 
                                href={`/${locale}${item.href}`}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm",
                                    isActive(item.href) 
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                                        : "hover:bg-slate-800 hover:text-white",
                                    item.highlight ? "animate-pulse border border-blue-500/50" : "",
                                    isCollapsed && "justify-center px-2",
                                    item.className
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 shrink-0",
                                    isActive(item.href) ? "text-white" : "text-slate-500 group-hover:text-white"
                                )} />
                                {!isCollapsed && (
                                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.label[locale]}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Tool Recommendation Card */}
        {!isCollapsed && (
            <div className="px-4 py-4 animate-in fade-in zoom-in">
               <AffiliateCard toolId="gamma" locale={locale} variant="compact" className="bg-slate-800/50 border-slate-700/50" />
            </div>
        )}

        {/* Footer */}
        <div className={cn("p-4 border-t border-slate-800 space-y-2", isCollapsed && "px-2 items-center flex flex-col")}>
            
            {/* Account Status Badge */}
            <div className={cn(
                "w-full flex items-center gap-2 p-2 rounded-xl bg-slate-800/30 border border-white/5 mb-2 overflow-hidden",
                isCollapsed && "justify-center p-1"
            )}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                    <CreditCard size={14} />
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Current Plan</span>
                        <span className="text-[10px] font-bold text-emerald-400">FREE MEMBER</span>
                    </div>
                )}
            </div>

                {/* Data Controls */}
            <div className={cn("flex gap-2 mb-2 w-full", isCollapsed && "flex-col items-center")}>
                <button 
                    onClick={handleBackup}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    title={locale === 'en' ? "Back up Data" : "نسخ احتياطي"}
                >
                    <Download className="w-3 h-3" />
                    {!isCollapsed && (locale === 'en' ? "Backup" : "نسخ")}
                </button>
                <button 
                    onClick={handleRestore}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                     title={locale === 'en' ? "Restore Data" : "استعادة"}
                >
                    <Upload className="w-3 h-3" />
                    {!isCollapsed && (locale === 'en' ? "Restore" : "استعادة")}
                </button>
            </div>

            {/* PWA Install Button (Phase 49) */}
            {!isCollapsed && deferredPrompt && (
                <Button 
                    onClick={handleInstall}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10 gap-2 font-black shadow-lg shadow-emerald-500/20 mt-2"
                >
                    <Download size={16} />
                    {locale === 'ar' ? 'تثبيت التطبيق' : 'Install App'}
                </Button>
            )}

            {/* User Profile / Auth Action (Phase 50) */}
            <div className="pt-2">
                {user ? (
                    <div className={cn(
                        "w-full p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 group transition-all",
                        isCollapsed && "justify-center p-2"
                    )}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-500 p-0.5 shrink-0">
                            <div className="w-full h-full rounded-[0.6rem] bg-slate-900 flex items-center justify-center overflow-hidden">
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} className="text-slate-400" />
                                )}
                            </div>
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 pr-1 pl-1">
                                <p className="text-sm font-black text-white truncate">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </p>
                                <button 
                                    onClick={() => signOut()}
                                    className="text-[10px] font-bold text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors mt-0.5"
                                >
                                    <LogOut size={10} />
                                    {locale === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Button 
                        onClick={() => router.push(`/${locale}/login`)}
                        className={cn(
                            "w-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 h-12 rounded-2xl font-black gap-2 transition-all",
                            isCollapsed && "px-0 justify-center"
                        )}
                    >
                        <LogIn size={18} />
                        {!isCollapsed && (locale === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
                    </Button>
                )}
            </div>
        </div>

        {/* Notification Center Panel */}
        <AnimatePresence>
            {showNotifications && (
                <NotificationCenter locale={locale} onClose={() => setShowNotifications(false)} />
            )}
        </AnimatePresence>
      </aside>
    </>
  );
}
