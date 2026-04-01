import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userProgressTable = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  moduleId: integer("module_id").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const userXpTable = pgTable("user_xp", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  totalXp: integer("total_xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserProgressSchema = createInsertSchema(userProgressTable).omit({ id: true, completedAt: true });
export const insertUserXpSchema = createInsertSchema(userXpTable).omit({ id: true, updatedAt: true });

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgressTable.$inferSelect;
export type UserXp = typeof userXpTable.$inferSelect;
