import { TeacherSidebar } from "@/components/layout/TeacherSidebar";
import type { Locale } from "@/config/i18n";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
        <TeacherSidebar locale={params.locale} />
        <main className="flex-1 overflow-y-auto w-full relative">
            <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-32">
                {children}
            </div>
        </main>
    </div>
  );
}
