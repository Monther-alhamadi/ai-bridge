"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
  items: {
    label: string;
    href: string;
  }[];
  locale: "en" | "ar";
}

export function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  // Schema.org JSON-LD for BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": process.env.NEXT_PUBLIC_SITE_URL || "https://aibridge7.netlify.app"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`
      }))
    ]
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-muted-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ol className="flex items-center gap-2">
        <li>
          <Link 
            href={`/${locale}`}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className={`h-4 w-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
            {index === items.length - 1 ? (
              <span className="font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
