import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  systemPrompt: text("system_prompt").notNull().default("あなたは会社の代表電話の受付を行うAIアシスタントです。主な目的は、営業電話に対して丁寧にお断りし、時間を節約することです。用件を聞き出し、営業であれば「恐れ入りますが、新規の営業はお断りしております」と伝えて電話を切ってください。"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  callerNumber: text("caller_number"),
  status: text("status").notNull(), // 'in-progress', 'completed', 'failed'
  transcript: jsonb("transcript").default([]), // Array of { role: 'user' | 'assistant', content: string }
  summary: text("summary"),
  duration: integer("duration").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settings).pick({
  systemPrompt: true,
});

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

export type Call = typeof calls.$inferSelect;
