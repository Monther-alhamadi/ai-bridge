"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 dark:bg-amber-900/30">
         <FileQuestion className="h-10 w-10 text-amber-600 dark:text-amber-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight">Page Not Found / الصفحة غير موجودة</h2>
        <p className="max-w-md text-muted-foreground">
          The page you are looking for does not exist or has been moved.<br/>
          الصفحة التي تبحث عنها غير متاحة أو تم تغيير رابطها.
        </p>
      </div>
      <Link href="/">
        <Button size="lg" className="rounded-xl font-bold">
          Back to Home / العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
}
