"use client";

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
    />
  );
}

export function ToolSkeleton() {
  return (
    <div className="w-full space-y-4 rounded-3xl border bg-card/30 p-8">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <div className="rounded-3xl border bg-card/10 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-6 border-b py-6 last:border-0">
            <Skeleton className="h-20 w-1/4" />
            <Skeleton className="h-20 w-1/4" />
            <Skeleton className="h-20 w-2/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
