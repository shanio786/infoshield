import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { lessonsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/lessons/:lessonId", async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId));
    if (!lesson) {
      res.status(404).json({ error: "Lesson not found" });
      return;
    }
    res.json(lesson);
  } catch (err) {
    req.log.error({ err }, "Error getting lesson");
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
});

router.post("/lessons", async (req, res) => {
  try {
    const { moduleId, title, content, estimatedMinutes, orderIndex } = req.body as {
      moduleId: number;
      title: string;
      content: string;
      estimatedMinutes?: number;
      orderIndex?: number;
    };
    const [lesson] = await db
      .insert(lessonsTable)
      .values({ moduleId, title, content, estimatedMinutes: estimatedMinutes ?? 10, orderIndex: orderIndex ?? 0 })
      .returning();
    res.status(201).json(lesson);
  } catch (err) {
    req.log.error({ err }, "Error creating lesson");
    res.status(500).json({ error: "Failed to create lesson" });
  }
});

router.put("/lessons/:lessonId", async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    const { title, content, estimatedMinutes, orderIndex } = req.body as {
      title?: string;
      content?: string;
      estimatedMinutes?: number;
      orderIndex?: number;
    };
    const updates: Partial<typeof lessonsTable.$inferInsert> = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (estimatedMinutes !== undefined) updates.estimatedMinutes = estimatedMinutes;
    if (orderIndex !== undefined) updates.orderIndex = orderIndex;

    const [lesson] = await db
      .update(lessonsTable)
      .set(updates)
      .where(eq(lessonsTable.id, lessonId))
      .returning();
    if (!lesson) {
      res.status(404).json({ error: "Lesson not found" });
      return;
    }
    res.json(lesson);
  } catch (err) {
    req.log.error({ err }, "Error updating lesson");
    res.status(500).json({ error: "Failed to update lesson" });
  }
});

router.delete("/lessons/:lessonId", async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    await db.delete(lessonsTable).where(eq(lessonsTable.id, lessonId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting lesson");
    res.status(500).json({ error: "Failed to delete lesson" });
  }
});

export default router;
