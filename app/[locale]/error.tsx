"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight">Something went wrong! / حدث خطأ غير متوقع</h2>
        <p className="max-w-md text-muted-foreground">
          We encountered an unexpected error. Our team has been notified.<br/>
          تم تسجيل الخطأ وسنعمل على حله فوراً.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go Home / الرئيسية
        </Button>
        <Button onClick={() => reset()}>Try Again / المحاولة مرة أخرى</Button>
      </div>
    </div>
  );
}
