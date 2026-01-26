import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  motivation: text("motivation"),
  frequency: text("frequency").notNull().default("daily"), // "daily" or comma-separated days
  completedDates: jsonb("completed_dates").notNull().default([]), // array of ISO date strings
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHabitSchema = createInsertSchema(habits).omit({ 
  id: true, 
  createdAt: true,
  completedDates: true 
});

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
