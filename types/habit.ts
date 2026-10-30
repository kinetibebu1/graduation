export type PriorityLevel = "low" | "medium" | "high";

export type HabitColor =
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "purple";

export interface StudyHabit {
  id: string;
  title: string;
  subject: string;
  description?: string;
  targetMinutes: number; // Daily target study minutes (e.g., 25, 45, 60)
  color: HabitColor;
  priority: PriorityLevel;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  archived?: boolean;
  order?: number; // Optional explicit display sequence index
}

export interface UpdateHabitInput {
  title: string;
  subject: string;
  description?: string;
  targetMinutes: number;
  color: HabitColor;
  priority: PriorityLevel;
}

export interface DeleteHabitOptions {
  purgeHistoricalLogs?: boolean; // Default false (orphaned logs preserved)
}

export interface HabitLogEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  durationMinutes?: number;
  notes?: string;
  completedAt: string; // ISO string
}

export type HabitFilterOption =
  | "all"
  | "pending"
  | "completed"
  | "high-priority"
  | "archived";

export interface DailyHabitStats {
  totalHabits: number;
  completedHabits: number;
  completionRate: number; // percentage (0 - 100)
  totalTargetMinutes: number;
  completedMinutes: number;
  currentStreakDays: number;
}
