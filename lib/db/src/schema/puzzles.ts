import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const puzzlesTable = pgTable("puzzles", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id"),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'word_match' | 'fill_blank' | 'drag_order'
  data: jsonb("data").notNull(),
  xpReward: integer("xp_reward").notNull().default(30),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const puzzleCompletionsTable = pgTable("puzzle_completions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  puzzleId: integer("puzzle_id").notNull().references(() => puzzlesTable.id),
  score: integer("score").notNull().default(100),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertPuzzleSchema = createInsertSchema(puzzlesTable).omit({ id: true, createdAt: true });
export const insertPuzzleCompletionSchema = createInsertSchema(puzzleCompletionsTable).omit({ id: true, completedAt: true });
export type Puzzle = typeof puzzlesTable.$inferSelect;
export type PuzzleCompletion = typeof puzzleCompletionsTable.$inferSelect;
export type InsertPuzzle = z.infer<typeof insertPuzzleSchema>;
