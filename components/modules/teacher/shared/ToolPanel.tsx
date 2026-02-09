import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/Badge';

interface ToolPanelProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon?: React.ReactNode;
  locale: 'en' | 'ar';
  backLink?: string;
}

export function ToolPanel({ children, title, description, icon, locale, backLink }: ToolPanelProps) {
  const isRTL = locale === 'ar';
  const effectiveBackLink = backLink || `/${locale}/tools/teacher`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-sm">
            <div className="flex items-start gap-4">
              <Link href={effectiveBackLink} className={cn("mt-1 p-2 rounded-full hover:bg-muted transition-colors", isRTL && "rotate-180")}>
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {icon && <span className="text-primary">{icon}</span>}
                  <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    {title}
                  </h1>
                   <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Premium</Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                  {description}
                </p>
              </div>
           </div>
        </header>

        {/* Main Content */}
        <main className="relative">
          {children}
        </main>
      </div>
    </div>
  );
}

// Progress Bar Component
interface ProgressBarProps {
  progress: number; // 0 to 100
  status: string;
  locale: 'en' | 'ar';
}

export function ProgressBar({ progress, status, locale }: ProgressBarProps) {
  return (
    <div className="w-full space-y-3 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-end px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
            {status}
        </span>
        <span className="text-sm font-mono font-bold text-primary">
            {Math.round(progress)}%
        </span>
      </div>
      <div className="h-3 w-full bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm overflow-hidden rounded-full border border-white/20 p-0.5 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-primary transition-all duration-1000 ease-in-out rounded-full relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
            {/* Animated Glow Line */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </div>
      </div>
    </div>
  );
}
