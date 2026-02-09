import { SubjectSettings } from "@/components/modules/teacher/SubjectSettings";
import type { Locale } from "@/config/i18n";

interface PageProps {
  params: {
    locale: Locale;
  };
}

export default function SubjectSettingsPage({ params }: PageProps) {
  return (
    <div className="space-y-6">
        <header className="mb-8">
            <h1 className="text-3xl font-black text-slate-900">
                {params.locale === 'en' ? 'Subject Store' : 'مخزن المواد'}
            </h1>
            <p className="text-slate-500">
                {params.locale === 'en' ? 'Manage your teaching materials and schedules.' : 'أدر موادك الدراسية وجدولك الزمني.'}
            </p>
        </header>

        <SubjectSettings locale={params.locale} />
    </div>
  );
}
