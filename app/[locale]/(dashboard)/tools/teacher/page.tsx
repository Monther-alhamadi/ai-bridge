import { TeacherModule } from "@/components/modules/TeacherModule";
import type { Locale } from "@/config/i18n";

interface PageProps {
  params: {
    locale: Locale;
  };
}

export default function TeacherDashboardPage({ params }: PageProps) {
  return (
    <div className="space-y-6">
        {/* We can add a simple header here since Marketing Nav is gone */}
        <header className="mb-8">
            <h1 className="text-3xl font-black text-slate-900">
                {params.locale === 'en' ? 'Dashboard' : 'لوحة التحكم'}
            </h1>
            <p className="text-slate-500">
                {params.locale === 'en' ? 'Welcome back to your workspace.' : 'أهلاً بك في مساحة عملك.'}
            </p>
        </header>

        <TeacherModule locale={params.locale} profession="teacher" toolSlug="dashboard" />
    </div>
  );
}
