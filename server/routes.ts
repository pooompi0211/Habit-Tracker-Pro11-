import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Purely local storage app - backend routes are minimal placeholders
  // to prevent server crashes on startup.
  
  app.get("/api/habits", async (_req, res) => {
    res.json([]);
  });

  return httpServer;
}
