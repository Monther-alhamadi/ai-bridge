export function AdSlot({ position }: { position: "top" | "middle" | "footer" }) {
  return (
    <div className="my-8 w-full">
      <div className="flex aspect-[32/9] w-full items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 md:aspect-[8/1]">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest opacity-50">
            Space for Ads - {position}
          </p>
        </div>
      </div>
    </div>
  );
}
