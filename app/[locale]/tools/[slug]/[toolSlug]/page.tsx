import { notFound } from "next/navigation";
import { professions } from "@/config/professions";
import type { Locale } from "@/config/i18n";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExamGenerator } from "@/components/ExamGenerator";
import { AdSlot } from "@/components/AdSlot";
import { NewsletterSignup } from "@/components/NewsletterSignup";

// Component Registry for Tool Modules
const TOOL_COMPONENTS: Record<string, any> = {
  "exam-generator": ExamGenerator,
  // Future tools like "campaign-planner", "legal-drafter" will go here
};

interface ToolPageProps {
  params: {
    locale: Locale;
    slug: string;     // profession slug: e.g., 'teacher'
    toolSlug: string; // tool slug: e.g., 'exam-generator'
  };
}

export default function DedicatedToolPage({ params }: ToolPageProps) {
  const profession = professions.find((p) => p.slug === params.slug);
  const { locale, toolSlug } = params;

  if (!profession) notFound();

  // Find the Tool Component
  const ToolComponent = TOOL_COMPONENTS[toolSlug];
  
  // Real tools should ideally be defined in config, but for now we look for component
  if (!ToolComponent) {
    return (
      <div className="container py-24 text-center space-y-4">
        <h1 className="text-4xl font-bold">{locale === 'en' ? 'Tool Under Construction' : 'الأداة قيد التطوير'}</h1>
        <p className="text-muted-foreground">{locale === 'en' ? 'We are building this precision tool for you.' : 'نحن نقوم ببناء هذه الأداة الاحترافية خصيصاً لك.'}</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: locale === "en" ? "Explore" : "الرئيسية", href: `/${locale}` },
    { label: locale === "en" ? "Tools" : "الأدوات", href: `/${locale}/tools` },
    { label: profession.title[locale], href: `/${locale}/tools/${params.slug}` },
    { label: toolSlug.replace(/-/g, ' ').toUpperCase(), href: `/${locale}/tools/${params.slug}/${toolSlug}` }
  ];

  return (
    <div className="container py-12 md:py-20 space-y-12">
      <Breadcrumbs items={breadcrumbItems} locale={locale} />
      
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-3xl font-black md:text-5xl capitalize">
            {toolSlug.replace(/-/g, ' ')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
            {locale === 'en' 
              ? `Professional AI control panel for ${profession.title.en} specializing in ${toolSlug.replace(/-/g, ' ')}.`
              : `لوحة تحكم احترافية لـ ${profession.title.ar}، متخصصة في ${toolSlug.replace(/-/g, ' ')}.`}
          </p>
        </header>

        <AdSlot position="top" />

        <div className="relative">
             <ToolComponent locale={locale} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            <NewsletterSignup profession={profession.title[locale]} locale={locale} />
            <div className="rounded-2xl border p-8 bg-muted/30">
                <h3 className="font-bold text-xl mb-4">{locale === 'en' ? 'Pro Strategy' : 'استراتيجية احترافية'}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === 'en' 
                      ? "Use the sliders and counters to define precise requirements. Our AI 'Prompt Factory' will automatically engineer a high-quality prompt in the background to ensure you get professional-grade results every time."
                      : "استخدم المنزلقات والعدادات لتحديد المتطلبات بدقة. سيقوم 'مصنع البرومبتات' الخاص بنا بهندسة طلب عالي الجودة في الخلفية لضمان حصولك على نتائج احترافية في كل مرة."}
                </p>
            </div>
        </div>

        <AdSlot position="footer" />
      </div>
    </div>
  );
}
