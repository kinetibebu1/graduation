import {
  DailyHabitStats,
  DeleteHabitOptions,
  HabitColor,
  HabitFilterOption,
  HabitLogEntry,
  PriorityLevel,
  StudyHabit,
  UpdateHabitInput,
} from "@/types/habit";
import { getTodayDateString } from "@/lib/utils";

const VALID_COLORS: HabitColor[] = [
  "indigo",
  "emerald",
  "amber",
  "rose",
  "sky",
  "purple",
];

const VALID_PRIORITIES: PriorityLevel[] = ["low", "medium", "high"];

/**
 * Validates that an unknown object adheres to the StudyHabit interface.
 */
export function isStudyHabit(item: unknown): item is StudyHabit {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.subject === "string" &&
    typeof candidate.targetMinutes === "number" &&
    typeof candidate.color === "string" &&
    typeof candidate.priority === "string" &&
    typeof candidate.createdAt === "string"
  );
}

/**
 * Type guard for an array of StudyHabit items.
 */
export function isStudyHabitsArray(raw: unknown): raw is StudyHabit[] {
  return Array.isArray(raw) && raw.every(isStudyHabit);
}

/**
 * Validates that an unknown object adheres to the HabitLogEntry interface.
 */
export function isHabitLogEntry(item: unknown): item is HabitLogEntry {
  if (!item || typeof item !== "object") return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.habitId === "string" &&
    typeof candidate.date === "string" &&
    typeof candidate.completed === "boolean" &&
    typeof candidate.completedAt === "string"
  );
}

/**
 * Type guard for an array of HabitLogEntry items.
 */
export function isHabitLogsArray(raw: unknown): raw is HabitLogEntry[] {
  return Array.isArray(raw) && raw.every(isHabitLogEntry);
}

/**
 * Validates habit inputs for creating or editing a study habit.
 * Enforces field lengths, sensible numeric duration boundaries, and enum checks.
 */
export function validateHabitInput(input: Partial<UpdateHabitInput>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const title = input.title?.trim() ?? "";
  if (!title) {
    errors.title = "Habit title is required.";
  } else if (title.length > 100) {
    errors.title = "Habit title cannot exceed 100 characters.";
  }

  const subject = input.subject?.trim() ?? "";
  if (!subject) {
    errors.subject = "Subject is required.";
  } else if (subject.length > 50) {
    errors.subject = "Subject cannot exceed 50 characters.";
  }

  if (input.description) {
    const desc = input.description.trim();
    if (desc.length > 300) {
      errors.description = "Notes / focus intent cannot exceed 300 characters.";
    }
  }

  const minutes = input.targetMinutes;
  if (typeof minutes !== "number" || Number.isNaN(minutes)) {
    errors.targetMinutes = "Target duration must be a valid number.";
  } else if (!Number.isInteger(minutes) || minutes < 5 || minutes > 480) {
    errors.targetMinutes = "Target duration must be between 5 and 480 minutes (8 hours).";
  }

  if (input.priority && !VALID_PRIORITIES.includes(input.priority)) {
    errors.priority = "Priority must be low, medium, or high.";
  }

  if (input.color && !VALID_COLORS.includes(input.color)) {
    errors.color = "Invalid tag color tone selected.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Provides a structured default starter set tailored for students.
 */
export function getInitialSeedHabits(): StudyHabit[] {
  const timestamp = "2026-01-01T00:00:00.000Z";
  return [
    {
      id: "habit-seed-1",
      title: "Deep Work Problem Solving",
      subject: "Mathematics & CS",
      description: "Uninterrupted focus session working through assigned problem sets without distractions.",
      targetMinutes: 45,
      color: "indigo",
      priority: "high",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "habit-seed-2",
      title: "Active Recall & Flashcards",
      subject: "Biology & Science",
      description: "Spaced repetition practice using Anki or summary review sheets.",
      targetMinutes: 25,
      color: "emerald",
      priority: "medium",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "habit-seed-3",
      title: "Academic Paper & Notes Review",
      subject: "Literature & History",
      description: "Synthesizing lecture notes and reading primary sources for upcoming essays.",
      targetMinutes: 30,
      color: "purple",
      priority: "medium",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}

/**
 * Checks whether a specific habit was completed on a given date string.
 */
export function isHabitCompletedOnDate(
  habitId: string,
  logs: HabitLogEntry[],
  dateStr: string = getTodayDateString()
): boolean {
  return logs.some(
    (log) => log.habitId === habitId && log.date === dateStr && log.completed
  );
}

/**
 * Toggles or updates the completion status of a habit for a date.
 */
export function toggleHabitLog(
  habitId: string,
  logs: HabitLogEntry[],
  dateStr: string = getTodayDateString(),
  targetMinutes: number = 30
): HabitLogEntry[] {
  const existingIndex = logs.findIndex(
    (log) => log.habitId === habitId && log.date === dateStr
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const existing = logs[existingIndex];
    const updated = [...logs];
    updated[existingIndex] = {
      ...existing,
      completed: !existing.completed,
      completedAt: now,
    };
    return updated;
  }

  const newEntry: HabitLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    habitId,
    date: dateStr,
    completed: true,
    durationMinutes: targetMinutes,
    completedAt: now,
  };

  return [...logs, newEntry];
}

/**
 * Edits a habit in place while preserving its stable ID, creation timestamp,
 * archive status, and display position.
 */
export function editHabitInList(
  habits: StudyHabit[],
  habitId: string,
  updates: UpdateHabitInput
): { nextHabits: StudyHabit[]; updatedHabit: StudyHabit | null } {
  const index = habits.findIndex((h) => h.id === habitId);
  if (index === 0 && habits.length === 0) {
    return { nextHabits: habits, updatedHabit: null };
  }
  if (index === -1) {
    return { nextHabits: habits, updatedHabit: null };
  }

  const existing = habits[index];
  const now = new Date().toISOString();

  const updatedHabit: StudyHabit = {
    ...existing,
    title: updates.title.trim(),
    subject: updates.subject.trim() || "General Study",
    description: updates.description?.trim() || undefined,
    targetMinutes: Math.round(updates.targetMinutes),
    color: updates.color,
    priority: updates.priority,
    updatedAt: now,
  };

  const nextHabits = [...habits];
  nextHabits[index] = updatedHabit;

  return { nextHabits, updatedHabit };
}

/**
 * Archives a habit so it is removed from active daily views without altering historical completion logs.
 */
export function archiveHabitInList(
  habits: StudyHabit[],
  habitId: string
): StudyHabit[] {
  const now = new Date().toISOString();
  return habits.map((habit) =>
    habit.id === habitId
      ? { ...habit, archived: true, updatedAt: now }
      : habit
  );
}

/**
 * Restores an archived habit back into the active daily routine.
 */
export function restoreHabitInList(
  habits: StudyHabit[],
  habitId: string
): StudyHabit[] {
  const now = new Date().toISOString();
  return habits.map((habit) =>
    habit.id === habitId
      ? { ...habit, archived: false, updatedAt: now }
      : habit
  );
}

/**
 * Reorders active habits up or down.
 * Preserves the set of habit IDs and their historical logs.
 * Bounds are respected: first active habit cannot move up; last cannot move down.
 */
export function reorderHabitsInList(
  habits: StudyHabit[],
  habitId: string,
  direction: "up" | "down"
): StudyHabit[] {
  const activeHabits = habits.filter((h) => !h.archived);
  const activeIndex = activeHabits.findIndex((h) => h.id === habitId);

  if (activeIndex === -1) return habits;
  if (direction === "up" && activeIndex === 0) return habits;
  if (direction === "down" && activeIndex === activeHabits.length - 1) return habits;

  const targetIndex = direction === "up" ? activeIndex - 1 : activeIndex + 1;

  // Swap active habits
  const nextActive = [...activeHabits];
  const [moved] = nextActive.splice(activeIndex, 1);
  nextActive.splice(targetIndex, 0, moved);

  // Reconstruct full list preserving archived items' relative positions
  let activeCursor = 0;
  return habits.map((h) => {
    if (h.archived) return h;
    const replacement = nextActive[activeCursor];
    activeCursor++;
    return replacement;
  });
}

/**
 * Explicit Deletion Policy:
 * - The habit is removed from the habits collection.
 * - By default (purgeHistoricalLogs !== true), historical completion logs are retained
 *   as preserved historical records (orphaned historical data) so lifetime study volume
 *   and past weekly logs remain accurate.
 * - When options.purgeHistoricalLogs === true, completion logs for this habit ID are purged.
 */
export function deleteHabitFromList(
  habits: StudyHabit[],
  logs: HabitLogEntry[],
  habitId: string,
  options?: DeleteHabitOptions
): { nextHabits: StudyHabit[]; nextLogs: HabitLogEntry[] } {
  const nextHabits = habits.filter((h) => h.id !== habitId);

  let nextLogs = logs;
  if (options?.purgeHistoricalLogs) {
    nextLogs = logs.filter((log) => log.habitId !== habitId);
  }

  return { nextHabits, nextLogs };
}

/**
 * Calculates the consecutive daily streak for a specific habit.
 */
export function calculateHabitStreak(
  habitId: string,
  logs: HabitLogEntry[],
  referenceDateStr: string = getTodayDateString()
): number {
  const completedDates = new Set(
    logs
      .filter((log) => log.habitId === habitId && log.completed)
      .map((log) => log.date)
  );

  if (completedDates.size === 0) return 0;

  const refDate = new Date(referenceDateStr);
  let streak = 0;

  const isCompletedToday = completedDates.has(referenceDateStr);
  const checkDate = new Date(refDate);

  if (!isCompletedToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const y = checkDate.getFullYear();
    const m = String(checkDate.getMonth() + 1).padStart(2, "0");
    const d = String(checkDate.getDate()).padStart(2, "0");
    const formatted = `${y}-${m}-${d}`;

    if (completedDates.has(formatted)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Computes daily summary statistics for active habits and logs.
 * Archived habits are excluded from today's targets and completion requirements.
 */
export function calculateDailyStats(
  habits: StudyHabit[],
  logs: HabitLogEntry[],
  todayStr: string = getTodayDateString()
): DailyHabitStats {
  const activeHabits = habits.filter((h) => !h.archived);
  const totalHabits = activeHabits.length;

  if (totalHabits === 0) {
    return {
      totalHabits: 0,
      completedHabits: 0,
      completionRate: 0,
      totalTargetMinutes: 0,
      completedMinutes: 0,
      currentStreakDays: 0,
    };
  }

  let completedHabits = 0;
  let totalTargetMinutes = 0;
  let completedMinutes = 0;

  for (const habit of activeHabits) {
    totalTargetMinutes += habit.targetMinutes;
    const isCompleted = isHabitCompletedOnDate(habit.id, logs, todayStr);
    if (isCompleted) {
      completedHabits++;
      completedMinutes += habit.targetMinutes;
    }
  }

  const completionRate =
    totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // Find max streak among active habits
  let maxStreak = 0;
  for (const habit of activeHabits) {
    const streak = calculateHabitStreak(habit.id, logs, todayStr);
    if (streak > maxStreak) {
      maxStreak = streak;
    }
  }

  return {
    totalHabits,
    completedHabits,
    completionRate,
    totalTargetMinutes,
    completedMinutes,
    currentStreakDays: maxStreak,
  };
}

/**
 * Filters the list of habits according to the selected filter tab.
 * "archived": returns only habits marked as archived.
 * All other filter tabs return only active habits.
 */
export function filterHabits(
  habits: StudyHabit[],
  filter: HabitFilterOption,
  logs: HabitLogEntry[],
  todayStr: string = getTodayDateString()
): StudyHabit[] {
  if (filter === "archived") {
    return habits.filter((h) => !!h.archived);
  }

  const activeHabits = habits.filter((h) => !h.archived);

  switch (filter) {
    case "completed":
      return activeHabits.filter((h) =>
        isHabitCompletedOnDate(h.id, logs, todayStr)
      );
    case "pending":
      return activeHabits.filter(
        (h) => !isHabitCompletedOnDate(h.id, logs, todayStr)
      );
    case "high-priority":
      return activeHabits.filter((h) => h.priority === "high");
    case "all":
    default:
      return activeHabits;
  }
}
