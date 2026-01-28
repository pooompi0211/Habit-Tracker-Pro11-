import { format, getDay, startOfDay, isBefore } from "date-fns";

export interface Habit {
  id: string;
  name: string;
  motivation: string;
  frequency: "daily" | "weekly" | "custom" | "timed" | "goal";
  days: number[]; // Used for custom (weekdays) and weekly
  customDates?: string[]; // ISO strings or YYYY-MM-DD
  scheduledTime?: string;
  goalStreak?: number;
  progress: Record<string, boolean>;
  createdAt: string;
}

/**
 * Unified visibility function to determine if a habit should be shown on a specific date.
 */
export function shouldShowHabit(habit: Habit, date: Date): boolean {
  const dateStart = startOfDay(date);
  const createdAt = startOfDay(new Date(habit.createdAt));

  // Habit didn't exist yet
  if (isBefore(dateStart, createdAt)) return false;

  const dateStr = format(date, "yyyy-MM-dd");
  const dayIdx = getDay(date);

  switch (habit.frequency) {
    case "daily":
    case "timed":
    case "goal":
      return true;
    case "weekly":
      // Weekly habit only on selected weekdays
      return habit.days?.includes(dayIdx) ?? false;
    case "custom":
      // Custom habit only on selected specific dates
      return habit.customDates?.includes(dateStr) ?? false;
    default:
      return false;
  }
}
