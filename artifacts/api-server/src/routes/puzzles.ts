import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { puzzlesTable, puzzleCompletionsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/puzzles", async (req, res) => {
  try {
    const puzzles = await db.select().from(puzzlesTable).orderBy(puzzlesTable.id);
    res.json(puzzles);
  } catch (err) {
    req.log.error({ err }, "Error listing puzzles");
    res.status(500).json({ error: "Failed to fetch puzzles" });
  }
});

router.get("/puzzles/:puzzleId", async (req, res) => {
  try {
    const puzzleId = parseInt(req.params.puzzleId);
    const [puzzle] = await db.select().from(puzzlesTable).where(eq(puzzlesTable.id, puzzleId));
    if (!puzzle) { res.status(404).json({ error: "Puzzle not found" }); return; }
    res.json(puzzle);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch puzzle" });
  }
});

router.post("/puzzles/:puzzleId/complete", async (req, res) => {
  try {
    const puzzleId = parseInt(req.params.puzzleId);
    const { userId, score } = req.body as { userId: string; score?: number };

    const [existing] = await db.select().from(puzzleCompletionsTable)
      .where(and(eq(puzzleCompletionsTable.userId, userId), eq(puzzleCompletionsTable.puzzleId, puzzleId)));

    if (existing) {
      res.json({ alreadyCompleted: true, completion: existing });
      return;
    }

    const [completion] = await db.insert(puzzleCompletionsTable).values({
      userId,
      puzzleId,
      score: score ?? 100,
    }).returning();

    res.status(201).json({ alreadyCompleted: false, completion });
  } catch (err) {
    req.log.error({ err }, "Error completing puzzle");
    res.status(500).json({ error: "Failed to record puzzle completion" });
  }
});

router.get("/puzzles/user/:userId/completions", async (req, res) => {
  try {
    const completions = await db.select().from(puzzleCompletionsTable)
      .where(eq(puzzleCompletionsTable.userId, req.params.userId));
    res.json(completions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch completions" });
  }
});

export default router;
