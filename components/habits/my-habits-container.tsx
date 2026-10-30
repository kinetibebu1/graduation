"use client";

import React, { useState } from "react";
import { BookOpen, Clock, Layers, Plus } from "lucide-react";
import { StudyHabit } from "@/types/habit";
import { useHabits } from "@/hooks/use-habits";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { HabitList } from "@/components/habits/habit-list";
import { HabitFormModal } from "@/components/habits/habit-form-modal";
import { DeleteHabitDialog } from "@/components/habits/delete-habit-dialog";
import { SummaryCard } from "@/components/ui/summary-card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { formatDuration } from "@/lib/utils";

export function MyHabitsContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<StudyHabit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<StudyHabit | null>(null);

  const {
    habits,
    activeHabits,
    archivedHabits,
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

  // Distinct active subjects count
  const distinctSubjects = new Set(activeHabits.map((h) => h.subject.trim()));

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
        {/* Page Title & Add Habit CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#20251F]">
              My Study Habits
            </h2>
            <p className="text-xs text-[#737B72] mt-1 max-w-xl">
              Configure and maintain your daily academic study routine. Keep 2 to 4 core daily habits for maximum consistency.
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
        </div>

        {/* Alerts */}
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

        {/* Routine Architecture KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            title="Active Study Habits"
            icon={BookOpen}
            value={activeHabits.length}
            subtitle={
              archivedHabits.length > 0
                ? `${stats.completedHabits} done today • ${archivedHabits.length} archived`
                : `${stats.completedHabits} completed today`
            }
          />
          <SummaryCard
            title="Subjects Covered"
            icon={Layers}
            value={distinctSubjects.size}
            subtitle="Active academic disciplines"
          />
          <SummaryCard
            title="Daily Target Study Time"
            icon={Clock}
            value={formatDuration(stats.totalTargetMinutes)}
            subtitle="Scheduled study block duration"
          />
        </div>

        {/* Habit Checklist Section */}
        <section className="bg-white rounded-2xl border border-[#E3E7E1] p-5 sm:p-6 shadow-[0_1px_2px_rgba(32,37,31,0.03)]">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#20251F] leading-tight">
              Habit Checklist & Filtering
            </h3>
            <p className="text-xs text-[#737B72] mt-0.5">
              Review, filter, reorder, or edit your study routines.
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
