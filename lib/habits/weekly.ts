import { HabitLogEntry, StudyHabit } from "@/types/habit";
import { isHabitCompletedOnDate } from "@/lib/habits/domain";
import { getTodayDateString } from "@/lib/utils";

export interface WeeklyDayData {
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // "Mon", "Tue", etc.
  dayNumber: number; // 28
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  completedCount: number;
  totalHabits: number;
  rate: number; // 0 - 100
}

/**
 * Computes the 7-day week (Monday to Sunday) containing referenceDateStr.
 */
export function getWeeklyBreakdown(
  habits: StudyHabit[],
  logs: HabitLogEntry[],
  referenceDateStr: string = getTodayDateString()
): {
  days: WeeklyDayData[];
  weekTotalCompleted: number;
  weekTargetTotal: number;
  completionRate: number;
} {
  const [refYear, refMonth, refDay] = referenceDateStr.split("-").map(Number);
  const refDate = new Date(refYear, refMonth - 1, refDay);

  // Determine Monday of current week (ISO week: Monday = 1, Sunday = 0 -> 7)
  const currentDayOfWeek = refDate.getDay(); // 0 is Sunday, 1 is Monday
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

  const monday = new Date(refDate);
  monday.setDate(refDate.getDate() + distanceToMonday);

  const activeHabits = habits.filter((h) => !h.archived);
  const totalActive = activeHabits.length;

  const days: WeeklyDayData[] = [];
  let weekTotalCompleted = 0;
  let weekEligibleTarget = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const isToday = dateStr === referenceDateStr;
    const isPast = dateStr < referenceDateStr;
    const isFuture = dateStr > referenceDateStr;

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayLabel = dayLabels[d.getDay()];

    let completedCount = 0;
    if (!isFuture && totalActive > 0) {
      for (const habit of activeHabits) {
        if (isHabitCompletedOnDate(habit.id, logs, dateStr)) {
          completedCount++;
        }
      }
    }

    if (!isFuture) {
      weekTotalCompleted += completedCount;
      weekEligibleTarget += totalActive;
    }

    const rate =
      totalActive > 0 ? Math.round((completedCount / totalActive) * 100) : 0;

    days.push({
      dateStr,
      dayLabel,
      dayNumber: d.getDate(),
      isToday,
      isPast,
      isFuture,
      completedCount,
      totalHabits: totalActive,
      rate,
    });
  }

  const completionRate =
    weekEligibleTarget > 0
      ? Math.round((weekTotalCompleted / weekEligibleTarget) * 100)
      : 0;

  return {
    days,
    weekTotalCompleted,
    weekTargetTotal: weekEligibleTarget,
    completionRate,
  };
}

/**
 * Provides realistic, structured sample student weekly data strictly for UI design evaluation.
 * Never conflated with real logs.
 */
export function getSampleWeeklyBreakdown(): {
  days: WeeklyDayData[];
  weekTotalCompleted: number;
  weekTargetTotal: number;
  completionRate: number;
} {
  return {
    weekTotalCompleted: 14,
    weekTargetTotal: 18,
    completionRate: 78,
    days: [
      {
        dateStr: "2026-10-26",
        dayLabel: "Mon",
        dayNumber: 26,
        isToday: false,
        isPast: true,
        isFuture: false,
        completedCount: 3,
        totalHabits: 3,
        rate: 100,
      },
      {
        dateStr: "2026-10-27",
        dayLabel: "Tue",
        dayNumber: 27,
        isToday: false,
        isPast: true,
        isFuture: false,
        completedCount: 3,
        totalHabits: 3,
        rate: 100,
      },
      {
        dateStr: "2026-10-28",
        dayLabel: "Wed",
        dayNumber: 28,
        isToday: true,
        isPast: false,
        isFuture: false,
        completedCount: 2,
        totalHabits: 3,
        rate: 67,
      },
      {
        dateStr: "2026-10-29",
        dayLabel: "Thu",
        dayNumber: 29,
        isToday: false,
        isPast: false,
        isFuture: true,
        completedCount: 0,
        totalHabits: 3,
        rate: 0,
      },
      {
        dateStr: "2026-10-30",
        dayLabel: "Fri",
        dayNumber: 30,
        isToday: false,
        isPast: false,
        isFuture: true,
        completedCount: 0,
        totalHabits: 3,
        rate: 0,
      },
      {
        dateStr: "2026-10-31",
        dayLabel: "Sat",
        dayNumber: 31,
        isToday: false,
        isPast: false,
        isFuture: true,
        completedCount: 0,
        totalHabits: 3,
        rate: 0,
      },
      {
        dateStr: "2026-11-01",
        dayLabel: "Sun",
        dayNumber: 1,
        isToday: false,
        isPast: false,
        isFuture: true,
        completedCount: 0,
        totalHabits: 3,
        rate: 0,
      },
    ],
  };
}

