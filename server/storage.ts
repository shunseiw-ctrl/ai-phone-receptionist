import { db } from "./db";
import { settings, calls, type InsertSettings, type Settings, type Call } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getSettings(): Promise<Settings>;
  updateSettings(update: InsertSettings): Promise<Settings>;
  
  getCalls(): Promise<Call[]>;
  getCall(id: number): Promise<Call | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getSettings(): Promise<Settings> {
    const allSettings = await db.select().from(settings);
    if (allSettings.length === 0) {
      // Create default
      const [newSettings] = await db.insert(settings).values({}).returning();
      return newSettings;
    }
    return allSettings[0];
  }

  async updateSettings(update: InsertSettings): Promise<Settings> {
    const current = await this.getSettings();
    const [updated] = await db.update(settings)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(settings.id, current.id))
      .returning();
    return updated;
  }

  async getCalls(): Promise<Call[]> {
    return await db.select().from(calls).orderBy(desc(calls.createdAt));
  }

  async getCall(id: number): Promise<Call | undefined> {
    const [call] = await db.select().from(calls).where(eq(calls.id, id));
    return call;
  }
}

export const storage = new DatabaseStorage();
