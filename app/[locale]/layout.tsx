import type { Metadata } from "next";
import "@/app/globals.css";
import { inter, cairo } from "@/config/fonts";
import { ThemeProvider } from "@/components/providers";
import { siteConfig } from "@/config/site";
import { i18n, type Locale } from "@/config/i18n";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  const font = params.locale === "ar" ? cairo : inter;
  const dir = params.locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={params.locale} dir={dir} suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          hrefLang="en"
          href={`${siteConfig.url}/en`}
        />
        <link
          rel="alternate"
          hrefLang="ar"
          href={`${siteConfig.url}/ar`}
        />
      </head>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

