import React from "react";
import { CheckCircle2, Clock, Flame, Target } from "lucide-react";
import { DailyHabitStats } from "@/types/habit";
import { formatDuration } from "@/lib/utils";
import { SummaryCard } from "@/components/ui/summary-card";

export interface HabitStatsOverviewProps {
  stats: DailyHabitStats;
}

export function HabitStatsOverview({ stats }: HabitStatsOverviewProps) {
  const remainingCount = Math.max(0, stats.totalHabits - stats.completedHabits);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Daily Progress */}
      <SummaryCard
        title="Daily Goal Progress"
        icon={Target}
        value={`${stats.completionRate}%`}
        subtitle={`${stats.completedHabits} of ${stats.totalHabits} routines done today`}
        progress={stats.completionRate}
      />

      {/* 2. Habits Completed */}
      <SummaryCard
        title="Habits Completed"
        icon={CheckCircle2}
        value={stats.completedHabits}
        subtitle={
          stats.totalHabits === 0
            ? "No study habits configured"
            : remainingCount === 0
            ? "All scheduled sessions completed!"
            : `${remainingCount} session${remainingCount === 1 ? "" : "s"} remaining today`
        }
      />

      {/* 3. Study Time Volume */}
      <SummaryCard
        title="Study Target Volume"
        icon={Clock}
        value={formatDuration(stats.completedMinutes)}
        subtitle={`of ${formatDuration(stats.totalTargetMinutes)} planned today`}
      />

      {/* 4. Current Streak */}
      <SummaryCard
        title="Active Daily Streak"
        icon={Flame}
        value={`${stats.currentStreakDays} ${stats.currentStreakDays === 1 ? "day" : "days"}`}
        subtitle={
          stats.currentStreakDays > 0
            ? "Consecutive daily check-ins"
            : "Complete today's list to start"
        }
      />
    </div>
  );
}
