"use client";

import React, { useState } from "react";
import { Calendar, Info } from "lucide-react";
import { HabitLogEntry, StudyHabit } from "@/types/habit";
import {
  getSampleWeeklyBreakdown,
  getWeeklyBreakdown,
  WeeklyDayData,
} from "@/lib/habits/weekly";
import { cn } from "@/lib/utils";

export interface WeeklyProgressViewProps {
  habits: StudyHabit[];
  logs: HabitLogEntry[];
  todayDateStr: string;
}

export function WeeklyProgressView({
  habits,
  logs,
  todayDateStr,
}: WeeklyProgressViewProps) {
  const [viewMode, setViewMode] = useState<"live" | "sample">("live");

  const liveData = getWeeklyBreakdown(habits, logs, todayDateStr);
  const sampleData = getSampleWeeklyBreakdown();

  const activeData = viewMode === "live" ? liveData : sampleData;

  return (
    <div className="bg-white border border-[#E3E7E1] rounded-2xl p-5 shadow-[0_1px_2px_rgba(32,37,31,0.03)] space-y-4">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#20251F] text-base leading-none">
              Weekly Consistency
            </h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F0F4F0] text-[#3E5540] border border-[#D8DFD7]">
              Current Week
            </span>
          </div>
          <p className="text-xs text-[#737B72] mt-1">
            Tracking deliberate study session completions Monday through Sunday.
          </p>
        </div>

        {/* Live vs Sample Toggle (clearly separated demo data) */}
        <div className="inline-flex items-center rounded-lg bg-[#F8F9F6] border border-[#E3E7E1] p-0.5 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("live")}
            className={cn(
              "px-2.5 py-1 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F]",
              viewMode === "live"
                ? "bg-white text-[#20251F] shadow-xs font-semibold"
                : "text-[#737B72] hover:text-[#20251F]"
            )}
          >
            Live Logs ({liveData.weekTotalCompleted})
          </button>
          <button
            type="button"
            onClick={() => setViewMode("sample")}
            className={cn(
              "px-2.5 py-1 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F]",
              viewMode === "sample"
                ? "bg-white text-[#20251F] shadow-xs font-semibold"
                : "text-[#737B72] hover:text-[#20251F]"
            )}
          >
            Sample Preview
          </button>
        </div>
      </div>

      {/* Explicit Sample Notice */}
      {viewMode === "sample" && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0F4F0] border border-[#D8DFD7] text-xs text-[#3E5540]">
          <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <strong>Sample Data Preview:</strong> Demonstrating populated weekly routine for design review. Your real logs and streaks remain untouched.
          </span>
        </div>
      )}

      {/* 7-Day Calendar Strip */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 pt-1">
        {activeData.days.map((day: WeeklyDayData) => {
          const isFullyDone =
            day.totalHabits > 0 && day.completedCount === day.totalHabits;
          const isPartiallyDone =
            day.completedCount > 0 && day.completedCount < day.totalHabits;

          return (
            <div
              key={day.dateStr}
              className={cn(
                "flex flex-col items-center justify-between p-2 sm:p-3 rounded-xl border transition-all text-center",
                day.isToday
                  ? "bg-[#F0F4F0]/60 border-[#6D896F] ring-1 ring-[#6D896F]/40"
                  : day.isFuture
                  ? "bg-[#FAFBF9] border-[#EAEFE8] text-[#8F978E]"
                  : "bg-white border-[#E3E7E1]"
              )}
            >
              {/* Day Name */}
              <span
                className={cn(
                  "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider",
                  day.isToday ? "text-[#5A735C]" : "text-[#737B72]"
                )}
              >
                {day.dayLabel}
              </span>

              {/* Day Number Circle */}
              <div
                className={cn(
                  "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-xs font-bold my-1.5 transition-colors",
                  day.isToday
                    ? "bg-[#6D896F] text-white shadow-xs"
                    : isFullyDone
                    ? "bg-[#E3EAE3] text-[#3E5540]"
                    : isPartiallyDone
                    ? "bg-[#F0F4F0] text-[#5A735C]"
                    : "text-[#737B72]"
                )}
              >
                {day.dayNumber}
              </div>

              {/* Completion Fraction / Status */}
              <div className="text-[10px] sm:text-xs">
                {day.isFuture ? (
                  <span className="text-[#8F978E]">—</span>
                ) : day.totalHabits === 0 ? (
                  <span className="text-[#8F978E]">0/0</span>
                ) : (
                  <span
                    className={cn(
                      "font-medium tabular-nums",
                      isFullyDone
                        ? "text-[#3E5540] font-semibold"
                        : isPartiallyDone
                        ? "text-[#5A735C]"
                        : "text-[#737B72]"
                    )}
                  >
                    {day.completedCount}/{day.totalHabits}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Week Summary Line (Honest and Clear) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E3E7E1] text-xs text-[#737B72]">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[#5A735C]" />
          <span>
            {activeData.weekTotalCompleted} of {activeData.weekTargetTotal} study sessions checked off this week
          </span>
        </div>
        <div className="text-[#20251F] font-medium">
          Weekly rate: {activeData.completionRate}%
        </div>
      </div>
    </div>
  );
}
