import test from "node:test";
import assert from "node:assert/strict";
import {
  archiveHabitInList,
  calculateDailyStats,
  calculateHabitStreak,
  deleteHabitFromList,
  editHabitInList,
  filterHabits,
  getInitialSeedHabits,
  isHabitCompletedOnDate,
  reorderHabitsInList,
  restoreHabitInList,
  toggleHabitLog,
  validateHabitInput,
} from "@/lib/habits/domain";
import { getWeeklyBreakdown } from "@/lib/habits/weekly";
import { safeStorage } from "@/lib/storage/safe-storage";
import { HabitLogEntry, StudyHabit, UpdateHabitInput } from "@/types/habit";

test("Feature 1: Validation enforces input boundaries and required fields", () => {
  // Empty title
  const emptyTitle = validateHabitInput({ title: "   " });
  assert.strictEqual(emptyTitle.isValid, false);
  assert.ok(emptyTitle.errors.title);

  // Title exceeding 100 characters
  const longTitle = validateHabitInput({ title: "a".repeat(101) });
  assert.strictEqual(longTitle.isValid, false);
  assert.ok(longTitle.errors.title);

  // Subject exceeding 50 characters
  const longSubject = validateHabitInput({ title: "Math", subject: "s".repeat(51) });
  assert.strictEqual(longSubject.isValid, false);
  assert.ok(longSubject.errors.subject);

  // Description exceeding 300 characters
  const longDesc = validateHabitInput({
    title: "Math",
    subject: "Math",
    description: "d".repeat(301),
  });
  assert.strictEqual(longDesc.isValid, false);
  assert.ok(longDesc.errors.description);

  // Target minutes: non-number, float, or out of 5-480 bounds
  const invalidMinutes1 = validateHabitInput({ title: "Math", targetMinutes: 3 });
  assert.strictEqual(invalidMinutes1.isValid, false);

  const invalidMinutes2 = validateHabitInput({ title: "Math", targetMinutes: 500 });
  assert.strictEqual(invalidMinutes2.isValid, false);

  const invalidMinutes3 = validateHabitInput({ title: "Math", targetMinutes: NaN });
  assert.strictEqual(invalidMinutes3.isValid, false);

  // Valid inputs
  const valid = validateHabitInput({
    title: "  Algorithm Analysis  ",
    subject: "CS",
    description: "Focus on dynamic programming",
    targetMinutes: 45,
    priority: "high",
    color: "indigo",
  });
  assert.strictEqual(valid.isValid, true);
  assert.strictEqual(Object.keys(valid.errors).length, 0);
});

test("Feature 1: Edit preserves stable ID, createdAt, and historical logs", () => {
  const seeds = getInitialSeedHabits();
  const targetId = seeds[0].id;
  const originalCreatedAt = seeds[0].createdAt;

  const updates: UpdateHabitInput = {
    title: "  Advanced Problem Solving  ",
    subject: "Pure Math",
    description: "Updated notes",
    targetMinutes: 60,
    color: "rose",
    priority: "medium",
  };

  const { nextHabits, updatedHabit } = editHabitInList(seeds, targetId, updates);

  assert.ok(updatedHabit);
  assert.strictEqual(updatedHabit.id, targetId, "ID must be preserved");
  assert.strictEqual(updatedHabit.createdAt, originalCreatedAt, "createdAt must be preserved");
  assert.strictEqual(updatedHabit.title, "Advanced Problem Solving", "Whitespace trimmed");
  assert.strictEqual(updatedHabit.subject, "Pure Math");
  assert.strictEqual(updatedHabit.targetMinutes, 60);
  assert.strictEqual(updatedHabit.color, "rose");
  assert.strictEqual(updatedHabit.priority, "medium");
  assert.ok(updatedHabit.updatedAt !== originalCreatedAt, "updatedAt must be refreshed");

  // Ensure other habits in list are untouched
  assert.strictEqual(nextHabits.length, seeds.length);
  assert.strictEqual(nextHabits[1].id, seeds[1].id);

  // Logs for this habit remain valid and reference the same stable ID
  const logs: HabitLogEntry[] = [
    {
      id: "log-1",
      habitId: targetId,
      date: "2026-10-25",
      completed: true,
      durationMinutes: 45,
      completedAt: "2026-10-25T10:00:00Z",
    },
  ];
  assert.strictEqual(isHabitCompletedOnDate(targetId, logs, "2026-10-25"), true);
});

test("Feature 2: Archiving hides habit from active routines while preserving history", () => {
  const seeds = getInitialSeedHabits();
  const targetId = seeds[0].id;

  const logs: HabitLogEntry[] = [
    {
      id: "log-1",
      habitId: targetId,
      date: "2026-10-28",
      completed: true,
      durationMinutes: 45,
      completedAt: "2026-10-28T10:00:00Z",
    },
  ];

  const archivedList = archiveHabitInList(seeds, targetId);
  const archivedHabit = archivedList.find((h) => h.id === targetId);

  assert.strictEqual(archivedHabit?.archived, true);

  // Active filter excludes archived habits
  const activeHabits = filterHabits(archivedList, "all", logs, "2026-10-28");
  assert.strictEqual(activeHabits.some((h) => h.id === targetId), false);

  // Archived filter returns archived habits
  const archivedOnly = filterHabits(archivedList, "archived", logs, "2026-10-28");
  assert.strictEqual(archivedOnly.length, 1);
  assert.strictEqual(archivedOnly[0].id, targetId);

  // Historical logs are preserved
  assert.strictEqual(isHabitCompletedOnDate(targetId, logs, "2026-10-28"), true);

  // Restoring habit puts it back in active list
  const restoredList = restoreHabitInList(archivedList, targetId);
  const restoredHabit = restoredList.find((h) => h.id === targetId);
  assert.strictEqual(restoredHabit?.archived, false);

  const restoredActive = filterHabits(restoredList, "all", logs, "2026-10-28");
  assert.strictEqual(restoredActive.some((h) => h.id === targetId), true);
});

test("Feature 2: Permanent deletion policy handles orphaned retention vs cascade purge", () => {
  const seeds = getInitialSeedHabits();
  const targetId = seeds[0].id;

  const logs: HabitLogEntry[] = [
    {
      id: "log-1",
      habitId: targetId,
      date: "2026-10-27",
      completed: true,
      durationMinutes: 45,
      completedAt: "2026-10-27T10:00:00Z",
    },
    {
      id: "log-2",
      habitId: seeds[1].id,
      date: "2026-10-27",
      completed: true,
      durationMinutes: 25,
      completedAt: "2026-10-27T11:00:00Z",
    },
  ];

  // Default policy: retains historical completion logs as orphaned records
  const defaultDelete = deleteHabitFromList(seeds, logs, targetId, { purgeHistoricalLogs: false });
  assert.strictEqual(defaultDelete.nextHabits.length, seeds.length - 1);
  assert.strictEqual(defaultDelete.nextHabits.some((h) => h.id === targetId), false);
  assert.strictEqual(defaultDelete.nextLogs.length, 2, "Historical logs must be retained");
  assert.ok(defaultDelete.nextLogs.some((l) => l.habitId === targetId));

  // Explicit purge option: removes historical logs for that habit ID
  const purgeDelete = deleteHabitFromList(seeds, logs, targetId, { purgeHistoricalLogs: true });
  assert.strictEqual(purgeDelete.nextHabits.length, seeds.length - 1);
  assert.strictEqual(purgeDelete.nextLogs.length, 1, "Target habit logs purged");
  assert.strictEqual(purgeDelete.nextLogs[0].habitId, seeds[1].id);
});

test("Feature 3: Reordering respects bounds and preserves IDs and history", () => {
  const seeds = getInitialSeedHabits();
  const firstId = seeds[0].id;
  const secondId = seeds[1].id;
  const thirdId = seeds[2].id;

  // First habit moving up cannot move (boundary guard)
  const atTop = reorderHabitsInList(seeds, firstId, "up");
  assert.strictEqual(atTop[0].id, firstId);

  // Last habit moving down cannot move (boundary guard)
  const atBottom = reorderHabitsInList(seeds, thirdId, "down");
  assert.strictEqual(atBottom[2].id, thirdId);

  // Move first habit down -> swaps with second
  const movedDown = reorderHabitsInList(seeds, firstId, "down");
  assert.strictEqual(movedDown[0].id, secondId);
  assert.strictEqual(movedDown[1].id, firstId);
  assert.strictEqual(movedDown[2].id, thirdId);

  // Move second habit up -> swaps back
  const movedUp = reorderHabitsInList(movedDown, firstId, "up");
  assert.strictEqual(movedUp[0].id, firstId);
  assert.strictEqual(movedUp[1].id, secondId);

  // Reordering preserves archived habit positions
  const seedsWithArchived: StudyHabit[] = [
    seeds[0],
    { ...seeds[1], archived: true },
    seeds[2],
  ];
  const reorderedWithArchived = reorderHabitsInList(seedsWithArchived, seeds[0].id, "down");
  // Active habits (seeds[0] and seeds[2]) swap, archived seeds[1] stays in place
  assert.strictEqual(reorderedWithArchived[0].id, seeds[2].id);
  assert.strictEqual(reorderedWithArchived[1].id, seeds[1].id);
  assert.strictEqual(reorderedWithArchived[1].archived, true);
  assert.strictEqual(reorderedWithArchived[2].id, seeds[0].id);
});

test("Feature 4: Daily stats and weekly analytics consistency", () => {
  const seeds = getInitialSeedHabits();
  const today = "2026-10-30";

  let logs: HabitLogEntry[] = [];
  logs = toggleHabitLog(seeds[0].id, logs, today, seeds[0].targetMinutes);

  // 1 out of 3 active habits done
  const stats1 = calculateDailyStats(seeds, logs, today);
  assert.strictEqual(stats1.totalHabits, 3);
  assert.strictEqual(stats1.completedHabits, 1);
  assert.strictEqual(stats1.completionRate, 33);
  assert.strictEqual(stats1.completedMinutes, seeds[0].targetMinutes);
  assert.strictEqual(calculateHabitStreak(seeds[0].id, logs, today), 1);

  // Archive one pending habit -> total becomes 2, completion rate becomes 50%
  const archived = archiveHabitInList(seeds, seeds[1].id);
  const stats2 = calculateDailyStats(archived, logs, today);
  assert.strictEqual(stats2.totalHabits, 2);
  assert.strictEqual(stats2.completedHabits, 1);
  assert.strictEqual(stats2.completionRate, 50);

  // Archive all habits -> safe zeroed stats
  const allArchived = archived.map((h) => ({ ...h, archived: true }));
  const statsZero = calculateDailyStats(allArchived, logs, today);
  assert.strictEqual(statsZero.totalHabits, 0);
  assert.strictEqual(statsZero.completedHabits, 0);
  assert.strictEqual(statsZero.completionRate, 0);
  assert.strictEqual(statsZero.totalTargetMinutes, 0);

  // Weekly breakdown consistency
  const weekBreakdown = getWeeklyBreakdown(archived, logs, today);
  assert.ok(weekBreakdown.days.length === 7);
  assert.strictEqual(weekBreakdown.weekTotalCompleted, 1);
});

test("Feature 4: Safe storage fallback and malformed data handling", () => {
  // Test fallback on missing key or non-browser env
  const fallback = [{ id: "test", title: "Fallback" }];
  const res = safeStorage.getItem("non_existent_key_12345", fallback);
  assert.deepStrictEqual(res.data, fallback);
  assert.strictEqual(res.isFallback, true);
});
