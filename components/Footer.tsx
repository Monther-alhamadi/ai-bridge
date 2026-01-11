import { Locale } from "@/config/i18n";
import { getDictionary } from "@/lib/get-dictionary";

export async function Footer({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} {dictionary.common.appName}. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-sm font-medium underline underline-offset-4"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm font-medium underline underline-offset-4"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
