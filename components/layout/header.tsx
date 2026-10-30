import React from "react";
import { BookOpen, Calendar, Sparkles } from "lucide-react";
import { formatDisplayDate } from "@/lib/utils";

export interface HeaderProps {
  todayDateStr: string;
  onOpenAddModal?: () => void;
  onResetDefaults?: () => void;
}

export function Header({
  todayDateStr,
  onOpenAddModal,
  onResetDefaults,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200 dark:shadow-none">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
                StudyHabit
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Student MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Daily deliberate practice for academic success
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
            <span>{formatDisplayDate(todayDateStr)}</span>
          </div>

          {onResetDefaults && (
            <button
              type="button"
              onClick={onResetDefaults}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset to default student study habits"
            >
              Reset Samples
            </button>
          )}

          {onOpenAddModal && (
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>New Habit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
