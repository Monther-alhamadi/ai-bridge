import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Locale } from "@/config/i18n";

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default function MarketingLayout({ children, params }: MarketingLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar locale={params.locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={params.locale} />
    </div>
  );
}
