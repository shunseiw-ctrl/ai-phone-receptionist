import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingCalls = await storage.getCalls();
  if (existingCalls.length === 0) {
    const { db } = await import('./db');
    const { calls } = await import('@shared/schema');
    await db.insert(calls).values([
      {
        callerNumber: "090-1234-5678",
        status: "completed",
        duration: 45,
        transcript: [
          { role: "assistant", content: "お電話ありがとうございます。" },
          { role: "user", content: "○○会社の田中と申しますが、社長はいらっしゃいますか？" },
          { role: "assistant", content: "恐れ入りますが、新規の営業はお断りしております。" }
        ],
        summary: "○○会社の田中からの営業電話でした。お断りしました。"
      },
      {
        callerNumber: "03-9876-5432",
        status: "completed",
        duration: 120,
        transcript: [
          { role: "assistant", content: "お電話ありがとうございます。" },
          { role: "user", content: "いつもお世話になっております。××株式会社の鈴木です。先日のお見積りの件で..." },
          { role: "assistant", content: "担当者にお繋ぎします。" }
        ],
        summary: "××株式会社鈴木様より見積りの件。担当者への取り次ぎ。"
      }
    ]);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Settings routes
  app.get(api.settings.get.path, async (req, res) => {
    try {
      const s = await storage.getSettings();
      res.json(s);
    } catch (e) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.post(api.settings.update.path, async (req, res) => {
    try {
      const input = api.settings.update.input.parse(req.body);
      const updated = await storage.updateSettings(input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal error" });
    }
  });

  // Calls routes
  app.get(api.calls.list.path, async (req, res) => {
    try {
      const allCalls = await storage.getCalls();
      res.json(allCalls);
    } catch (e) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  app.get(api.calls.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const call = await storage.getCall(id);
      if (!call) {
        return res.status(404).json({ message: "Call not found" });
      }
      res.json(call);
    } catch (e) {
      res.status(500).json({ message: "Internal error" });
    }
  });

  seedDatabase().catch(console.error);

  return httpServer;
}
