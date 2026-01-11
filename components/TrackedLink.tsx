"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface TrackedLinkProps {
  href: string;
  name: string;
  context: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
}

export function TrackedLink({ href, name, context, className, children, target }: TrackedLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      onClick={() => trackEvent("affiliate_click", {
        item_id: name.toLowerCase().replace(/\s+/g, '-'),
        item_name: name,
        context: context
      })}
      className={className}
    >
      {children}
    </Link>
  );
}
