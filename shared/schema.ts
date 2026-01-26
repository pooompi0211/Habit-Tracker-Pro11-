import { pgTable, text, serial, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  motivation: text("motivation"),
  frequency: text("frequency").notNull().default("daily"), // "daily" | "custom"
  days: jsonb("days").notNull().default([]), // [0..6]
  progress: jsonb("progress").notNull().default({}), // { "YYYY-MM-DD": boolean }
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHabitSchema = createInsertSchema(habits).omit({ 
  id: true, 
  createdAt: true,
  progress: true 
});

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
