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

export default router;
