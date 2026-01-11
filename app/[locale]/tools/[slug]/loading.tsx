import { ToolSkeleton } from "@/components/Skeletons";
import { AdSlot } from "@/components/AdSlot";

export default function Loading() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl space-y-12">
        <AdSlot position="top" />
        
        <div className="space-y-4 text-center md:text-start animate-pulse">
          <div className="h-12 w-3/4 bg-muted rounded-xl mx-auto md:mx-0" />
          <div className="h-6 w-1/2 bg-muted rounded-xl mx-auto md:mx-0 opacity-70" />
        </div>

        <ToolSkeleton />
        
        <div className="h-64 w-full rounded-[2.5rem] border bg-muted/30" />
      </div>
    </div>
  );
}
