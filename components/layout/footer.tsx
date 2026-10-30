import React from "react";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            StudyHabit
          </span>
          <span>•</span>
          <span>Designed for focused student study sessions</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Local Browser Persistence</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Zero Backend Required</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
            <span>Offline Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
