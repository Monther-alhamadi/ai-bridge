import Link from "next/link";
import { professions } from "@/config/professions";
import { Locale } from "@/config/i18n";
import { ArrowRight } from "lucide-react";

export function RelatedTools({
  currentSlug,
  locale,
}: {
  currentSlug: string;
  locale: Locale;
}) {
  const related = professions.filter((p) => p.slug !== currentSlug).slice(0, 3);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">
        {locale === "en" ? "Explore More AI Tools" : "استكشف المزيد من أدوات الذكاء الاصطناعي"}
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {related.map((p) => (
          <Link
            key={p.id}
            href={`/${locale}/tools/${p.slug}`}
            className="group block rounded-xl border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
          >
            <h4 className="font-semibold transition-colors group-hover:text-primary">
              {p.title[locale]}
            </h4>
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {p.description[locale]}
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-primary">
              {locale === "en" ? "Open Tool" : "افتح الأداة"}
              <ArrowRight className={locale === "ar" ? "mr-1 h-3 w-3 rotate-180" : "ml-1 h-3 w-3"} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
