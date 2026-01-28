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
      // For weekly, we check if it's the selected weekday. 
      // If none selected, default to Monday (1)
      const weeklyDays = habit.days && habit.days.length > 0 ? habit.days : [1];
      return weeklyDays.includes(dayIdx);
    case "custom":
      // Show if it's in customDates OR if the weekday is in days (customDays)
      const isInCustomDates = habit.customDates?.includes(dateStr);
      const isInCustomDays = habit.days?.includes(dayIdx);
      return !!(isInCustomDates || isInCustomDays);
    default:
      return false;
  }
}
