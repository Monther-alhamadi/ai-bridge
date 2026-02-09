import { TeacherSidebar } from "@/components/layout/TeacherSidebar";
import type { Locale } from "@/config/i18n";
import { CurriculumProvider } from "@/lib/hooks/use-curriculum-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  return (
    <CurriculumProvider locale={params.locale}>
      <div className="flex bg-slate-50 min-h-screen">
          <TeacherSidebar locale={params.locale} />
          <main className="flex-1 w-full relative">
              <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-32 mt-16 lg:mt-0">
                  {children}
              </div>
          </main>
      </div>
    </CurriculumProvider>
  );
}
