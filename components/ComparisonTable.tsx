"use client";

import { ToolReview } from "@/config/professions";
import { Star, Check, X, ExternalLink, Award, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ComparisonTableProps {
  tools: ToolReview[];
  locale: "en" | "ar";
}

export function ComparisonTable({ tools, locale }: ComparisonTableProps) {
  if (tools.length === 0) return null;

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-2 text-center md:text-start">
        <h2 className="text-3xl font-bold tracking-tight">
          {locale === "en" ? "Top AI Tools Comparison" : "مقارنة أفضل أدوات الذكاء الاصطناعي"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "en" 
            ? "Hand-picked tools to supercharge your workflow." 
            : "أدوات مختارة بعناية لتعزيز إنتاجيتك بشكل مذهل."}
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border bg-card/30 backdrop-blur-xl shadow-2xl">
        <table className="w-full min-w-[800px] border-collapse text-start">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-6 text-start font-bold">{locale === "en" ? "Tool" : "الأداة"}</th>
              <th className="p-6 text-start font-bold">{locale === "en" ? "Rating" : "التقييم"}</th>
              <th className="p-6 text-start font-bold">{locale === "en" ? "Pros & Cons" : "المميزات والعيوب"}</th>
              <th className="p-6 text-start font-bold">{locale === "en" ? "Pricing" : "السعر"}</th>
              <th className="p-6 text-center font-bold">{locale === "en" ? "Action" : "الإجراء"}</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool, idx) => (
              <tr 
                key={idx} 
                className={cn(
                  "border-b last:border-0 transition-colors hover:bg-muted/30",
                  tool.badge && "bg-primary/[0.03]"
                )}
              >
                {/* Tool Name & Badge */}
                <td className="p-6 align-top">
                  <div className="space-y-3">
                    <div className="text-xl font-bold">{tool.name}</div>
                    {tool.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary animate-pulse">
                        <Award className="h-3 w-3" />
                        {tool.badge[locale]}
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {tool.description[locale]}
                    </p>
                  </div>
                </td>

                {/* Rating */}
                <td className="p-6 align-top">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-bold text-lg">{tool.rating}</span>
                  </div>
                </td>

                {/* Pros & Cons */}
                <td className="p-6 align-top">
                  <div className="space-y-4 max-w-xs">
                    <div className="space-y-1">
                      {tool.pros[locale].map((pro, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {tool.cons[locale].map((con, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4 text-destructive shrink-0" />
                          <span>{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>

                {/* Pricing */}
                <td className="p-6 align-top">
                  <div className="font-semibold text-primary">
                    {tool.price[locale]}
                  </div>
                </td>

                {/* Action CTA */}
                <td className="p-6 align-middle text-center">
                  <Link
                    href={tool.affiliateUrl || tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg",
                      tool.affiliateUrl 
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground" 
                        : "bg-background border-2 hover:bg-accent"
                    )}
                  >
                    {tool.affiliateUrl ? (
                      <>
                        <Zap className="h-4 w-4" />
                        {locale === "en" ? "Get Exclusive Deal" : "احصل على عرض حصري"}
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4" />
                        {locale === "en" ? "Visit Site" : "زيارة الموقع"}
                      </>
                    )}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
