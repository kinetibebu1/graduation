"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Flame, Info, Plus, Target } from "lucide-react";
import { useHabits } from "@/hooks/use-habits";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { WeeklyProgressView } from "@/components/habits/weekly-progress-view";
import { SummaryCard } from "@/components/ui/summary-card";
import { AddHabitModal } from "@/components/habits/add-habit-modal";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";

export function ProgressContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    habits,
    activeHabits,
    logs,
    stats,
    todayDateStr,
    addHabit,
    resetToDefaults,
  } = useHabits();

  // Calculate subject allocations for active routines
  const subjectMap = new Map<string, { count: number; minutes: number }>();
  for (const habit of activeHabits) {
    const existing = subjectMap.get(habit.subject) ?? { count: 0, minutes: 0 };
    subjectMap.set(habit.subject, {
      count: existing.count + 1,
      minutes: existing.minutes + habit.targetMinutes,
    });
  }

  const subjectEntries = Array.from(subjectMap.entries());
  const completedLogsCount = logs.filter((l) => l.completed).length;

  return (
    <AppShell
      todayDateStr={todayDateStr}
      onOpenAddModal={() => setIsModalOpen(true)}
      onResetDefaults={resetToDefaults}
    >
      <PageContainer>
        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#20251F]">
              Academic Progress & Consistency
            </h2>
            <p className="text-xs text-[#737B72] mt-1 max-w-xl">
              Track consistency across days, monitor active streaks, and inspect weekly routine execution.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto shrink-0"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Habit</span>
          </Button>
        </div>

        {/* High-level Consistency Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Active Streak"
            icon={Flame}
            value={`${stats.currentStreakDays} ${stats.currentStreakDays === 1 ? "day" : "days"}`}
            subtitle={
              stats.currentStreakDays > 0
                ? "Consecutive daily check-ins"
                : "Complete today to start streak"
            }
          />
          <SummaryCard
            title="Today's Completion"
            icon={Target}
            value={`${stats.completionRate}%`}
            subtitle={`${stats.completedHabits} of ${stats.totalHabits} routines met`}
            progress={stats.completionRate}
          />
          <SummaryCard
            title="Daily Target Volume"
            icon={Clock}
            value={formatDuration(stats.totalTargetMinutes)}
            subtitle="Scheduled study block time"
          />
          <SummaryCard
            title="Lifetime Check-ins"
            icon={CheckCircle2}
            value={completedLogsCount}
            subtitle="Verified study blocks completed"
          />
        </div>

        {/* Weekly Progress Visualization */}
        <section aria-label="Weekly Routine Visualization">
          <WeeklyProgressView
            habits={habits}
            logs={logs}
            todayDateStr={todayDateStr}
          />
        </section>

        {/* Subject Allocation Breakdown */}
        <section className="bg-white rounded-2xl border border-[#E3E7E1] p-5 sm:p-6 shadow-[0_1px_2px_rgba(32,37,31,0.03)] space-y-4">
          <div>
            <h3 className="text-base font-semibold text-[#20251F] leading-tight">
              Subject Study Allocation
            </h3>
            <p className="text-xs text-[#737B72] mt-0.5">
              Target study time per academic subject based on your configured habits.
            </p>
          </div>

          {subjectEntries.length === 0 ? (
            <p className="text-xs text-[#737B72] italic py-4 text-center">
              No active habits found. Add habits to see subject breakdowns.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subjectEntries.map(([subject, data]) => {
                const percentOfTotal =
                  stats.totalTargetMinutes > 0
                    ? Math.round((data.minutes / stats.totalTargetMinutes) * 100)
                    : 0;

                return (
                  <div
                    key={subject}
                    className="p-3.5 rounded-xl border border-[#E3E7E1] bg-[#FAFBF9] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#20251F] truncate">
                        {subject}
                      </span>
                      <span className="text-[11px] font-medium text-[#737B72]">
                        {data.count} habit{data.count === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-sm font-bold text-[#20251F]">
                        {formatDuration(data.minutes)}
                      </span>
                      <span className="text-[11px] text-[#737B72]">
                        {percentOfTotal}% of day
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#EBF0EB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6D896F] rounded-full"
                        style={{ width: `${percentOfTotal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Honest Streak & Analytics Methodology Note */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F0F4F0] border border-[#D8DFD7] text-xs text-[#3E5540]">
          <Info className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <span className="font-semibold block text-[#20251F]">
              Honest Student Progress Tracking
            </span>
            <p className="leading-relaxed text-[#737B72]">
              StudyHabit computes your streak strictly from consecutive days with at least one verified study check-in. Historical data is preserved in your local browser storage and is never fabricated or simulated as real.
            </p>
          </div>
        </div>
      </PageContainer>

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </AppShell>
  );
}
