"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  DailyHabitStats,
  DeleteHabitOptions,
  HabitFilterOption,
  HabitLogEntry,
  StudyHabit,
  UpdateHabitInput,
} from "@/types/habit";
import {
  calculateDailyStats,
  filterHabits,
  isHabitCompletedOnDate,
  toggleHabitLog,
  validateHabitInput,
} from "@/lib/habits/domain";
import { habitStore } from "@/lib/habits/habit-store";
import { getTodayDateString } from "@/lib/utils";

export interface UseHabitsReturn {
  habits: StudyHabit[];
  activeHabits: StudyHabit[];
  archivedHabits: StudyHabit[];
  filteredHabits: StudyHabit[];
  logs: HabitLogEntry[];
  isLoading: boolean;
  error: string | null;
  filter: HabitFilterOption;
  stats: DailyHabitStats;
  todayDateStr: string;
  successFeedback: string | null;
  setFilter: (filter: HabitFilterOption) => void;
  toggleHabit: (habitId: string) => void;
  addHabit: (
    newHabit: Omit<StudyHabit, "id" | "createdAt" | "updatedAt">
  ) => boolean;
  editHabit: (habitId: string, updates: UpdateHabitInput) => boolean;
  archiveHabit: (habitId: string) => void;
  restoreHabit: (habitId: string) => void;
  deleteHabit: (habitId: string, options?: DeleteHabitOptions) => void;
  moveHabit: (habitId: string, direction: "up" | "down") => void;
  resetToDefaults: () => void;
  clearError: () => void;
}

// React 18/19 idiom for detecting client hydration without setState in effect
const subscribeNoop = () => () => {};
const getClientTrue = () => true;
const getServerFalse = () => false;

export function useHabits(): UseHabitsReturn {
  // Synchronize state with habitStore using React's useSyncExternalStore
  const habits = useSyncExternalStore(
    habitStore.subscribe,
    habitStore.getHabitsSnapshot,
    habitStore.getServerHabitsSnapshot
  );

  const logs = useSyncExternalStore(
    habitStore.subscribe,
    habitStore.getLogsSnapshot,
    habitStore.getServerLogsSnapshot
  );

  const isClient = useSyncExternalStore(
    subscribeNoop,
    getClientTrue,
    getServerFalse
  );

  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<HabitFilterOption>("all");
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  const todayDateStr = useSyncExternalStore(
    subscribeNoop,
    getTodayDateString,
    () => "2026-01-01"
  );

  // Dismiss feedback automatically after 3 seconds
  useEffect(() => {
    if (!successFeedback) return;
    const timer = setTimeout(() => {
      setSuccessFeedback(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [successFeedback]);

  // Toggle completion for today
  const toggleHabit = useCallback(
    (habitId: string) => {
      const targetHabit = habits.find((h) => h.id === habitId);
      if (!targetHabit) return;

      const willBeCompleted = !isHabitCompletedOnDate(
        habitId,
        logs,
        todayDateStr
      );

      const nextLogs = toggleHabitLog(
        habitId,
        logs,
        todayDateStr,
        targetHabit.targetMinutes
      );

      habitStore.setLogs(nextLogs);

      if (willBeCompleted) {
        setSuccessFeedback(`Great work! Finished "${targetHabit.title}".`);
      }
    },
    [habits, logs, todayDateStr]
  );

  // Add a new study habit
  const addHabit = useCallback(
    (newHabit: Omit<StudyHabit, "id" | "createdAt" | "updatedAt">): boolean => {
      const validation = validateHabitInput(newHabit);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        setError(firstError ?? "Invalid habit data.");
        return false;
      }

      const now = new Date().toISOString();
      const habit: StudyHabit = {
        ...newHabit,
        id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: newHabit.title.trim(),
        subject: newHabit.subject.trim() || "General Study",
        createdAt: now,
        updatedAt: now,
      };

      const nextHabits = [habit, ...habits];
      habitStore.setHabits(nextHabits);

      setSuccessFeedback(`Added new study habit: "${habit.title}".`);
      return true;
    },
    [habits]
  );

  // Edit an existing study habit
  const editHabit = useCallback(
    (habitId: string, updates: UpdateHabitInput): boolean => {
      const validation = validateHabitInput(updates);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        setError(firstError ?? "Invalid habit updates.");
        return false;
      }

      const updated = habitStore.updateHabit(habitId, updates);
      if (!updated) {
        setError("Habit could not be found to update.");
        return false;
      }

      setSuccessFeedback(`Updated habit: "${updated.title}".`);
      return true;
    },
    []
  );

  // Archive a habit (hides from active views while preserving all historical logs)
  const archiveHabit = useCallback(
    (habitId: string) => {
      const target = habits.find((h) => h.id === habitId);
      const success = habitStore.archiveHabit(habitId);
      if (success && target) {
        setSuccessFeedback(`Archived "${target.title}". History is preserved.`);
      }
    },
    [habits]
  );

  // Restore an archived habit back into active view
  const restoreHabit = useCallback(
    (habitId: string) => {
      const target = habits.find((h) => h.id === habitId);
      const success = habitStore.restoreHabit(habitId);
      if (success && target) {
        setSuccessFeedback(`Restored "${target.title}" to active habits.`);
      }
    },
    [habits]
  );

  // Move habit up or down in active list
  const moveHabit = useCallback(
    (habitId: string, direction: "up" | "down") => {
      const success = habitStore.reorderHabit(habitId, direction);
      if (success) {
        const target = habits.find((h) => h.id === habitId);
        if (target) {
          setSuccessFeedback(`Moved "${target.title}" ${direction}.`);
        }
      }
    },
    [habits]
  );

  // Delete a study habit (with explicit history retention policy)
  const deleteHabit = useCallback(
    (habitId: string, options?: DeleteHabitOptions) => {
      const target = habits.find((h) => h.id === habitId);
      const success = habitStore.deleteHabit(habitId, options);
      if (success && target) {
        const historyNotice = options?.purgeHistoricalLogs
          ? "and purged past completion logs"
          : "with past logs preserved";
        setSuccessFeedback(`Deleted habit "${target.title}" (${historyNotice}).`);
      }
    },
    [habits]
  );

  // Reset to default seed habits
  const resetToDefaults = useCallback(() => {
    habitStore.resetAll();
    setSuccessFeedback("Reset habits to default student template.");
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Compute active and archived lists
  const activeHabits = useMemo(
    () => habits.filter((h) => !h.archived),
    [habits]
  );

  const archivedHabits = useMemo(
    () => habits.filter((h) => !!h.archived),
    [habits]
  );

  // Compute stats and filtered lists
  const stats = useMemo(
    () => calculateDailyStats(habits, logs, todayDateStr),
    [habits, logs, todayDateStr]
  );

  const filteredHabits = useMemo(
    () => filterHabits(habits, filter, logs, todayDateStr),
    [habits, filter, logs, todayDateStr]
  );

  return {
    habits,
    activeHabits,
    archivedHabits,
    filteredHabits,
    logs,
    isLoading: !isClient,
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
  };
}
