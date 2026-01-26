import { users, type User, type InsertUser } from "@shared/schema";
import { habits, type Habit, type InsertHabit } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getHabits(): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  deleteHabit(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private habits: Map<number, Habit>;
  private currentId: number;
  private currentHabitId: number;

  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.currentId = 1;
    this.currentHabitId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getHabits(): Promise<Habit[]> {
    return Array.from(this.habits.values());
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = this.currentHabitId++;
    const habit: Habit = { 
      ...insertHabit, 
      id, 
      motivation: insertHabit.motivation ?? null,
      frequency: insertHabit.frequency ?? "daily",
      completedDates: [],
      createdAt: new Date()
    };
    this.habits.set(id, habit);
    return habit;
  }

  async deleteHabit(id: number): Promise<void> {
    this.habits.delete(id);
  }
}

export const storage = new MemStorage();
