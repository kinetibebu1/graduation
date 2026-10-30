"use client";

import React from "react";
import { Archive, BookOpen, CheckCircle, Filter, Plus, RotateCcw } from "lucide-react";
import { HabitFilterOption, HabitLogEntry, StudyHabit } from "@/types/habit";
import { calculateHabitStreak, isHabitCompletedOnDate } from "@/lib/habits/domain";
import { HabitCard } from "@/components/habits/habit-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export interface HabitListProps {
  habits: StudyHabit[];
  allHabitsCount: number;
  logs: HabitLogEntry[];
  todayDateStr: string;
  filter: HabitFilterOption;
  isLoading: boolean;
  onFilterChange: (filter: HabitFilterOption) => void;
  onToggleHabit: (habitId: string) => void;
  onDeleteHabit: (habit: StudyHabit) => void;
  onEditHabit?: (habit: StudyHabit) => void;
  onArchiveHabit?: (habitId: string) => void;
  onRestoreHabit?: (habitId: string) => void;
  onMoveHabit?: (habitId: string, direction: "up" | "down") => void;
  onOpenAddModal: () => void;
  onResetDefaults: () => void;
}

export function HabitList({
  habits,
  allHabitsCount,
  logs,
  todayDateStr,
  filter,
  isLoading,
  onFilterChange,
  onToggleHabit,
  onDeleteHabit,
  onEditHabit,
  onArchiveHabit,
  onRestoreHabit,
  onMoveHabit,
  onOpenAddModal,
  onResetDefaults,
}: HabitListProps) {
  const filterTabs: { id: HabitFilterOption; label: string }[] = [
    { id: "all", label: "All Habits" },
    { id: "pending", label: "Pending Today" },
    { id: "completed", label: "Completed" },
    { id: "high-priority", label: "High Priority" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter and Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E7E1] pb-3">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <Filter className="h-3.5 w-3.5 text-[#8F978E] mr-1 shrink-0" aria-hidden="true" />
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D896F] cursor-pointer",
                filter === tab.id
                  ? "bg-[#20251F] text-white font-semibold shadow-xs"
                  : "text-[#737B72] hover:text-[#20251F] hover:bg-[#F0F4F0]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={onOpenAddModal}
          className="self-start sm:self-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Add Study Habit</span>
        </Button>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-[#E3E7E1] bg-white animate-pulse flex items-start gap-3.5"
            >
              <div className="h-5 w-5 rounded-md bg-[#EEF2EC] shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-20 bg-[#EEF2EC] rounded" />
                <div className="h-4 w-44 bg-[#EEF2EC] rounded" />
                <div className="h-3 w-56 bg-[#F4F6F2] rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State: No habits in system at all */}
      {!isLoading && allHabitsCount === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No study habits yet"
          description="Build daily academic consistency by tracking 2–4 core study routines, problem sets, or revision blocks."
          action={
            <Button size="sm" variant="primary" onClick={onOpenAddModal}>
              <Plus className="h-3.5 w-3.5" />
              <span>Add Your First Habit</span>
            </Button>
          }
          secondaryAction={
            <Button size="sm" variant="outline" onClick={onResetDefaults}>
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Load Student Starter Habits</span>
            </Button>
          }
        />
      )}

      {/* Empty State: Archived filter selected but no archived habits */}
      {!isLoading && allHabitsCount > 0 && filter === "archived" && habits.length === 0 && (
        <EmptyState
          icon={Archive}
          title="No archived habits"
          description="Active habits that you archive will appear here. Archiving removes routines from your daily checklist while keeping your history and streaks intact."
          action={
            <Button size="sm" variant="outline" onClick={() => onFilterChange("all")}>
              View Active Habits
            </Button>
          }
        />
      )}

      {/* Empty State: Active filters produced 0 matches */}
      {!isLoading && allHabitsCount > 0 && filter !== "archived" && habits.length === 0 && (
        <EmptyState
          icon={CheckCircle}
          title={
            filter === "completed"
              ? "No habits completed yet today"
              : filter === "pending"
              ? "All caught up for today!"
              : "No matching habits found"
          }
          description={
            filter === "completed"
              ? "Check off your first study block to begin your daily streak."
              : filter === "pending"
              ? "Outstanding work! You have finished every planned study session for today."
              : "No habits currently match this filter criteria."
          }
          action={
            filter !== "all" ? (
              <Button size="sm" variant="outline" onClick={() => onFilterChange("all")}>
                View All Habits
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Habit Cards List */}
      {!isLoading && habits.length > 0 && (
        <div className="space-y-2.5">
          {habits.map((habit, index) => {
            const isCompleted = isHabitCompletedOnDate(
              habit.id,
              logs,
              todayDateStr
            );
            const streak = calculateHabitStreak(habit.id, logs, todayDateStr);

            // Reordering is supported when viewing all active habits
            const showReorder = filter === "all" && !habit.archived;
            const isFirst = index === 0;
            const isLast = index === habits.length - 1;

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={isCompleted}
                streak={streak}
                isFirst={isFirst}
                isLast={isLast}
                showReorder={showReorder}
                onToggle={onToggleHabit}
                onEdit={onEditHabit}
                onArchive={onArchiveHabit}
                onRestore={onRestoreHabit}
                onMove={onMoveHabit}
                onDelete={onDeleteHabit}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
