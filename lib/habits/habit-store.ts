import {
  DeleteHabitOptions,
  HabitLogEntry,
  StudyHabit,
  UpdateHabitInput,
} from "@/types/habit";
import {
  archiveHabitInList,
  deleteHabitFromList,
  editHabitInList,
  getInitialSeedHabits,
  isHabitLogsArray,
  isStudyHabitsArray,
  reorderHabitsInList,
  restoreHabitInList,
} from "@/lib/habits/domain";
import { safeStorage } from "@/lib/storage/safe-storage";

const STORAGE_KEYS = {
  HABITS: "habits_data",
  LOGS: "habit_logs_data",
};

// Default static server snapshots for SSR
const SERVER_HABITS_SNAPSHOT: StudyHabit[] = getInitialSeedHabits();
const SERVER_LOGS_SNAPSHOT: HabitLogEntry[] = [];

class HabitStore {
  private habitsCache: StudyHabit[] | null = null;
  private logsCache: HabitLogEntry[] | null = null;
  private listeners: Set<() => void> = new Set();
  private isListeningToWindow = false;

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private initWindowListener() {
    if (typeof window === "undefined" || this.isListeningToWindow) return;
    window.addEventListener("storage", (e) => {
      if (
        e.key?.includes(STORAGE_KEYS.HABITS) ||
        e.key?.includes(STORAGE_KEYS.LOGS)
      ) {
        // Invalidate cache on external storage updates
        this.habitsCache = null;
        this.logsCache = null;
        this.notify();
      }
    });
    this.isListeningToWindow = true;
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    this.initWindowListener();
    return () => {
      this.listeners.delete(listener);
    };
  };

  getHabitsSnapshot = (): StudyHabit[] => {
    if (this.habitsCache !== null) {
      return this.habitsCache;
    }

    const result = safeStorage.getItem<StudyHabit[]>(
      STORAGE_KEYS.HABITS,
      SERVER_HABITS_SNAPSHOT,
      isStudyHabitsArray
    );

    this.habitsCache = result.data;
    return this.habitsCache;
  };

  getServerHabitsSnapshot = (): StudyHabit[] => {
    return SERVER_HABITS_SNAPSHOT;
  };

  getLogsSnapshot = (): HabitLogEntry[] => {
    if (this.logsCache !== null) {
      return this.logsCache;
    }

    const result = safeStorage.getItem<HabitLogEntry[]>(
      STORAGE_KEYS.LOGS,
      SERVER_LOGS_SNAPSHOT,
      isHabitLogsArray
    );

    this.logsCache = result.data;
    return this.logsCache;
  };

  getServerLogsSnapshot = (): HabitLogEntry[] => {
    return SERVER_LOGS_SNAPSHOT;
  };

  setHabits(nextHabits: StudyHabit[]): void {
    this.habitsCache = nextHabits;
    safeStorage.setItem(STORAGE_KEYS.HABITS, nextHabits);
    this.notify();
  }

  setLogs(nextLogs: HabitLogEntry[]): void {
    this.logsCache = nextLogs;
    safeStorage.setItem(STORAGE_KEYS.LOGS, nextLogs);
    this.notify();
  }

  updateHabit(id: string, updates: UpdateHabitInput): StudyHabit | null {
    const current = this.getHabitsSnapshot();
    const { nextHabits, updatedHabit } = editHabitInList(current, id, updates);
    if (!updatedHabit) return null;
    this.setHabits(nextHabits);
    return updatedHabit;
  }

  archiveHabit(id: string): boolean {
    const current = this.getHabitsSnapshot();
    const exists = current.some((h) => h.id === id);
    if (!exists) return false;
    const next = archiveHabitInList(current, id);
    this.setHabits(next);
    return true;
  }

  restoreHabit(id: string): boolean {
    const current = this.getHabitsSnapshot();
    const exists = current.some((h) => h.id === id);
    if (!exists) return false;
    const next = restoreHabitInList(current, id);
    this.setHabits(next);
    return true;
  }

  reorderHabit(id: string, direction: "up" | "down"): boolean {
    const current = this.getHabitsSnapshot();
    const next = reorderHabitsInList(current, id, direction);
    if (next === current) return false;
    this.setHabits(next);
    return true;
  }

  deleteHabit(id: string, options?: DeleteHabitOptions): boolean {
    const currentHabits = this.getHabitsSnapshot();
    const currentLogs = this.getLogsSnapshot();
    const exists = currentHabits.some((h) => h.id === id);
    if (!exists) return false;

    const { nextHabits, nextLogs } = deleteHabitFromList(
      currentHabits,
      currentLogs,
      id,
      options
    );

    this.setHabits(nextHabits);
    if (nextLogs !== currentLogs) {
      this.setLogs(nextLogs);
    }
    return true;
  }

  resetAll(): void {
    const defaults = getInitialSeedHabits();
    this.habitsCache = defaults;
    this.logsCache = [];
    safeStorage.setItem(STORAGE_KEYS.HABITS, defaults);
    safeStorage.setItem(STORAGE_KEYS.LOGS, []);
    this.notify();
  }
}

export const habitStore = new HabitStore();
