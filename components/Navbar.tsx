import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Locale } from "@/config/i18n";
import { getDictionary } from "@/lib/get-dictionary";
import { siteConfig } from "@/config/site";

export async function Navbar({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl text-primary">
              {dictionary.common.appName}
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {dictionary.nav.home}
            </Link>
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {dictionary.nav.about}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
          <Link
            href="#"
            className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {dictionary.nav.login}
          </Link>
        </div>
      </div>
    </header>
  );
}
