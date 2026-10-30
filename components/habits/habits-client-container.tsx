"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { StudyHabit } from "@/types/habit";
import { useHabits } from "@/hooks/use-habits";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { HabitStatsOverview } from "@/components/habits/habit-stats-overview";
import { WeeklyProgressView } from "@/components/habits/weekly-progress-view";
import { HabitList } from "@/components/habits/habit-list";
import { HabitFormModal } from "@/components/habits/habit-form-modal";
import { DeleteHabitDialog } from "@/components/habits/delete-habit-dialog";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

function getGreetingTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function HabitsClientContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<StudyHabit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<StudyHabit | null>(null);

  const {
    habits,
    filteredHabits,
    logs,
    isLoading,
    error,
    filter,
    stats,
    todayDateStr,
    successFeedback,
    setFilter,
    toggleHabit,
    addHabit,
    editHabit,
    archiveHabit,
    restoreHabit,
    deleteHabit,
    moveHabit,
    resetToDefaults,
    clearError,
  } = useHabits();

  const greeting = getGreetingTime();
  const remainingCount = Math.max(0, stats.totalHabits - stats.completedHabits);

  const subtitle =
    stats.totalHabits === 0
      ? "Welcome to StudyHabit. Add your first study routine to start building consistent habits."
      : remainingCount === 0
      ? "All study routines checked off for today! Outstanding academic consistency."
      : `You have ${stats.totalHabits} habit${
          stats.totalHabits === 1 ? "" : "s"
        } scheduled for today. ${stats.completedHabits} of ${
          stats.totalHabits
        } completed so far.`;

  const handleOpenAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (habit: StudyHabit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  return (
    <AppShell
      todayDateStr={todayDateStr}
      onOpenAddModal={handleOpenAddModal}
      onResetDefaults={resetToDefaults}
    >
      <PageContainer>
        {/* Concise Greeting Header with Add Habit Action */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-[#20251F]">
                {greeting}, Student
              </h2>
            </div>
            <p className="text-xs text-[#737B72] mt-1 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddModal}
            className="self-start sm:self-auto shrink-0"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Habit</span>
          </Button>
        </section>

        {/* Feedback / Error Alerts */}
        {error && (
          <Alert variant="error" title="Storage Notice" onDismiss={clearError}>
            {error}
          </Alert>
        )}

        {successFeedback && (
          <Alert variant="success">
            {successFeedback}
          </Alert>
        )}

        {/* 1. Daily Progress & Streak Summary KPI Cards */}
        <section aria-label="Daily Study Summaries">
          <HabitStatsOverview stats={stats} />
        </section>

        {/* 2. Weekly Progress Visualization Area */}
        <section aria-label="Weekly Consistency Progress">
          <WeeklyProgressView
            habits={habits}
            logs={logs}
            todayDateStr={todayDateStr}
          />
        </section>

        {/* 3. Today's Study Checklist Section */}
        <section
          aria-label="Today's Habit Checklist"
          className="bg-white rounded-2xl border border-[#E3E7E1] p-5 sm:p-6 shadow-[0_1px_2px_rgba(32,37,31,0.03)]"
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#20251F] leading-tight">
              Today&apos;s Study Checklist
            </h3>
            <p className="text-xs text-[#737B72] mt-0.5">
              Check off completed study blocks to maintain your streak and build routine.
            </p>
          </div>

          <HabitList
            habits={filteredHabits}
            allHabitsCount={habits.length}
            logs={logs}
            todayDateStr={todayDateStr}
            filter={filter}
            isLoading={isLoading}
            onFilterChange={setFilter}
            onToggleHabit={toggleHabit}
            onEditHabit={handleOpenEditModal}
            onArchiveHabit={archiveHabit}
            onRestoreHabit={restoreHabit}
            onMoveHabit={moveHabit}
            onDeleteHabit={(h) => setDeletingHabit(h)}
            onOpenAddModal={handleOpenAddModal}
            onResetDefaults={resetToDefaults}
          />
        </section>
      </PageContainer>

      {/* Add / Edit Habit Modal */}
      <HabitFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        habitToEdit={editingHabit}
        onAdd={addHabit}
        onEdit={editHabit}
      />

      {/* Accessible Permanent Delete Confirmation Dialog */}
      <DeleteHabitDialog
        isOpen={Boolean(deletingHabit)}
        habit={deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={(habitId, options) => {
          deleteHabit(habitId, options);
          setDeletingHabit(null);
        }}
      />
    </AppShell>
  );
}
