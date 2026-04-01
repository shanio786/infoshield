import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  userProgressTable,
  userXpTable,
  userBadgesTable,
  badgesTable,
  quizAttemptsTable,
  modulesTable,
  lessonsTable,
} from "@workspace/db/schema";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/progress/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const progressRows = await db
      .select()
      .from(userProgressTable)
      .where(eq(userProgressTable.userId, userId));

    const [xpRow] = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId));

    const userBadgeRows = await db
      .select()
      .from(userBadgesTable)
      .where(eq(userBadgesTable.userId, userId));

    const earnedBadges = await Promise.all(
      userBadgeRows.map(async (ub) => {
        const [b] = await db.select().from(badgesTable).where(eq(badgesTable.id, ub.badgeId));
        return b;
      })
    );

    const quizAttempts = await db
      .select()
      .from(quizAttemptsTable)
      .where(eq(quizAttemptsTable.userId, userId));

    const completedLessons = progressRows.map((p) => p.lessonId);
    const completedModuleIds = [...new Set(progressRows.map((p) => p.moduleId))];

    const completedModules: number[] = [];
    for (const moduleId of completedModuleIds) {
      const [lc] = await db
        .select({ count: count() })
        .from(lessonsTable)
        .where(eq(lessonsTable.moduleId, moduleId));
      const totalLessons = Number(lc?.count ?? 0);
      const completedInModule = progressRows.filter((p) => p.moduleId === moduleId).length;
      if (totalLessons > 0 && completedInModule >= totalLessons) {
        completedModules.push(moduleId);
      }
    }

    res.json({
      userId,
      totalXp: xpRow?.totalXp ?? 0,
      level: xpRow?.level ?? 1,
      completedLessons,
      completedModules,
      earnedBadges: earnedBadges.filter(Boolean),
      quizAttempts: quizAttempts.map((qa) => ({
        quizId: qa.quizId,
        score: qa.score,
        passed: qa.passed === 1,
        attemptedAt: qa.attemptedAt,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting progress");
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

router.post("/progress/:userId/complete-lesson", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lessonId, moduleId } = req.body as { lessonId: number; moduleId: number };

    const existing = await db
      .select()
      .from(userProgressTable)
      .where(eq(userProgressTable.userId, userId));

    const alreadyDone = existing.some((p) => p.lessonId === lessonId);
    if (!alreadyDone) {
      await db.insert(userProgressTable).values({ userId, lessonId, moduleId });

      const xpRows = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId));
      if (xpRows.length === 0) {
        await db.insert(userXpTable).values({ userId, totalXp: 10, level: 1 });
      } else {
        const newXp = xpRows[0].totalXp + 10;
        const newLevel = Math.floor(newXp / 200) + 1;
        await db.update(userXpTable).set({ totalXp: newXp, level: newLevel }).where(eq(userXpTable.userId, userId));
      }
    }

    const updatedProgress = await db
      .select()
      .from(userProgressTable)
      .where(eq(userProgressTable.userId, userId));
    const [xpRow] = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId));
    const userBadgeRows = await db.select().from(userBadgesTable).where(eq(userBadgesTable.userId, userId));
    const earnedBadges = await Promise.all(
      userBadgeRows.map(async (ub) => {
        const [b] = await db.select().from(badgesTable).where(eq(badgesTable.id, ub.badgeId));
        return b;
      })
    );
    const quizAttempts = await db.select().from(quizAttemptsTable).where(eq(quizAttemptsTable.userId, userId));

    res.json({
      userId,
      totalXp: xpRow?.totalXp ?? 10,
      level: xpRow?.level ?? 1,
      completedLessons: updatedProgress.map((p) => p.lessonId),
      completedModules: [],
      earnedBadges: earnedBadges.filter(Boolean),
      quizAttempts: quizAttempts.map((qa) => ({
        quizId: qa.quizId,
        score: qa.score,
        passed: qa.passed === 1,
        attemptedAt: qa.attemptedAt,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Error completing lesson");
    res.status(500).json({ error: "Failed to complete lesson" });
  }
});

export default router;
