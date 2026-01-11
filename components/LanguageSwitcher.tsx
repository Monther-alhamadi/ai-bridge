"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/config/i18n";
import { Languages } from "lucide-react";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const toggleLanguage = () => {
    const nextLocale = currentLocale === "en" ? "ar" : "en";
    router.push(redirectedPathname(nextLocale));
  };

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
    >
      <Languages className="h-4 w-4" />
      <span>{currentLocale === "en" ? "العربية" : "English"}</span>
    </button>
  );
}
