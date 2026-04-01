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

async function awardBadgeIfNew(userId: string, badgeId: number, existingBadgeIds: number[]) {
  if (existingBadgeIds.includes(badgeId)) return null;
  const [badge] = await db.select().from(badgesTable).where(eq(badgesTable.id, badgeId));
  if (!badge) return null;
  await db.insert(userBadgesTable).values({ userId, badgeId });
  existingBadgeIds.push(badgeId);
  return badge;
}

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

    const newBadges: (typeof badgesTable.$inferSelect)[] = [];

    const alreadyDone = existing.some((p) => p.lessonId === lessonId);
    if (!alreadyDone) {
      await db.insert(userProgressTable).values({ userId, lessonId, moduleId });

      const xpRows = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId));
      const XP_PER_LESSON = 10;
      if (xpRows.length === 0) {
        await db.insert(userXpTable).values({ userId, totalXp: XP_PER_LESSON, level: 1 });
      } else {
        const newXp = xpRows[0].totalXp + XP_PER_LESSON;
        const newLevel = Math.floor(newXp / 200) + 1;
        await db.update(userXpTable).set({ totalXp: newXp, level: newLevel }).where(eq(userXpTable.userId, userId));
      }

      const userBadgeRows = await db.select().from(userBadgesTable).where(eq(userBadgesTable.userId, userId));
      const existingBadgeIds = userBadgeRows.map((b) => b.badgeId);
      const updatedProgress = [...existing, { lessonId, moduleId, userId }];

      if (updatedProgress.length === 1) {
        const b = await awardBadgeIfNew(userId, 2, existingBadgeIds);
        if (b) newBadges.push(b);
      }

      const [lc] = await db.select({ count: count() }).from(lessonsTable).where(eq(lessonsTable.moduleId, moduleId));
      const totalInModule = Number(lc?.count ?? 0);
      const completedInModule = updatedProgress.filter((p) => p.moduleId === moduleId).length;
      if (totalInModule > 0 && completedInModule >= totalInModule) {
        const b = await awardBadgeIfNew(userId, 4, existingBadgeIds);
        if (b) newBadges.push(b);

        const allModules = await db.select().from(modulesTable);
        const [allLessonsCount] = await db.select({ count: count() }).from(lessonsTable);
        if (updatedProgress.length >= Number(allLessonsCount?.count ?? 0) && allModules.length > 0) {
          const completedModuleSet = new Set(updatedProgress.map((p) => p.moduleId));
          if (completedModuleSet.size >= allModules.length) {
            const b2 = await awardBadgeIfNew(userId, 5, existingBadgeIds);
            if (b2) newBadges.push(b2);
          }
        }
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

    const completedModuleIds: number[] = [];
    const completedModuleSet = new Set(updatedProgress.map((p) => p.moduleId));
    for (const mid of completedModuleSet) {
      const [lc] = await db.select({ count: count() }).from(lessonsTable).where(eq(lessonsTable.moduleId, mid));
      const total = Number(lc?.count ?? 0);
      const done = updatedProgress.filter((p) => p.moduleId === mid).length;
      if (total > 0 && done >= total) completedModuleIds.push(mid);
    }

    res.json({
      userId,
      totalXp: xpRow?.totalXp ?? 10,
      level: xpRow?.level ?? 1,
      completedLessons: updatedProgress.map((p) => p.lessonId),
      completedModules: completedModuleIds,
      earnedBadges: earnedBadges.filter(Boolean),
      newBadges,
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
