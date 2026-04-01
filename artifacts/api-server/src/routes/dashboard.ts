import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  userProgressTable,
  userXpTable,
  userBadgesTable,
  quizAttemptsTable,
  modulesTable,
  lessonsTable,
} from "@workspace/db/schema";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/stats", async (req, res) => {
  try {
    const [totalUsers] = await db.select({ count: count() }).from(userXpTable);
    const [totalLessons] = await db.select({ count: count() }).from(userProgressTable);
    const [totalQuizzes] = await db.select({ count: count() }).from(quizAttemptsTable);
    const [totalBadges] = await db.select({ count: count() }).from(userBadgesTable);

    res.json({
      totalUsers: Number(totalUsers?.count ?? 0),
      totalLessonsCompleted: Number(totalLessons?.count ?? 0),
      totalQuizzesTaken: Number(totalQuizzes?.count ?? 0),
      totalBadgesAwarded: Number(totalBadges?.count ?? 0),
      topBadges: [],
    });
  } catch (err) {
    req.log.error({ err }, "Error getting stats");
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const progressRows = await db.select().from(userProgressTable).where(eq(userProgressTable.userId, userId));
    const [xpRow] = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId));
    const userBadgeRows = await db.select().from(userBadgesTable).where(eq(userBadgesTable.userId, userId));
    const quizAttempts = await db.select().from(quizAttemptsTable).where(eq(quizAttemptsTable.userId, userId));

    const allModules = await db.select().from(modulesTable);
    const [totalLessonsRow] = await db.select({ count: count() }).from(lessonsTable);

    const quizzesPassed = quizAttempts.filter((a) => a.passed === 1).length;

    const completedModuleIds = [...new Set(progressRows.map((p) => p.moduleId))];
    let modulesCompleted = 0;
    for (const moduleId of completedModuleIds) {
      const [lc] = await db.select({ count: count() }).from(lessonsTable).where(eq(lessonsTable.moduleId, moduleId));
      const totalInMod = Number(lc?.count ?? 0);
      const completedInMod = progressRows.filter((p) => p.moduleId === moduleId).length;
      if (totalInMod > 0 && completedInMod >= totalInMod) modulesCompleted++;
    }

    const nextModule = allModules.find((m) => !completedModuleIds.includes(m.id)) ?? null;

    let nextModuleWithCount = null;
    if (nextModule) {
      const [lc] = await db.select({ count: count() }).from(lessonsTable).where(eq(lessonsTable.moduleId, nextModule.id));
      nextModuleWithCount = { ...nextModule, lessonCount: Number(lc?.count ?? 0) };
    }

    const recentActivity = [
      ...progressRows.slice(-3).map((p) => ({
        type: "lesson",
        description: `Completed lesson #${p.lessonId}`,
        timestamp: p.completedAt,
      })),
      ...quizAttempts.slice(-2).map((a) => ({
        type: "quiz",
        description: `Scored ${a.score}% on quiz #${a.quizId}`,
        timestamp: a.attemptedAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    res.json({
      userId,
      totalXp: xpRow?.totalXp ?? 0,
      level: xpRow?.level ?? 1,
      modulesCompleted,
      modulesTotal: allModules.length,
      lessonsCompleted: progressRows.length,
      lessonsTotal: Number(totalLessonsRow?.count ?? 0),
      quizzesPassed,
      badgesEarned: userBadgeRows.length,
      currentStreak: Math.min(progressRows.length, 7),
      recentActivity,
      nextModule: nextModuleWithCount,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting dashboard");
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

export default router;
