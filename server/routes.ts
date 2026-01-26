import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.habits.list.path, async (_req, res) => {
    const habits = await storage.getHabits();
    res.json(habits);
  });

  app.post(api.habits.create.path, async (req, res) => {
    try {
      const input = api.habits.create.input.parse(req.body);
      const habit = await storage.createHabit(input);
      res.status(201).json(habit);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.habits.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteHabit(id);
    res.status(204).send();
  });

  // Seed some initial data if empty
  const existing = await storage.getHabits();
  if (existing.length === 0) {
    await storage.createHabit({
      title: "Drink Water",
      description: "Drink 8 glasses of water daily",
    });
    await storage.createHabit({
      title: "Morning Jog",
      description: "Run for 30 minutes",
    });
  }

  return httpServer;
}
