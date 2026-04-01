import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  quizzesTable,
  quizQuestionsTable,
  quizAttemptsTable,
  badgesTable,
  userBadgesTable,
  userXpTable,
} from "@workspace/db/schema";
import { eq, count, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/quizzes", async (req, res) => {
  try {
    const moduleId = req.query.moduleId ? parseInt(req.query.moduleId as string) : undefined;
    const quizzes = moduleId
      ? await db.select().from(quizzesTable).where(eq(quizzesTable.moduleId, moduleId))
      : await db.select().from(quizzesTable);

    const result = await Promise.all(
      quizzes.map(async (quiz) => {
        const [qc] = await db
          .select({ count: count() })
          .from(quizQuestionsTable)
          .where(eq(quizQuestionsTable.quizId, quiz.id));
        return { ...quiz, questionCount: Number(qc?.count ?? 0) };
      })
    );
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error listing quizzes");
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

router.get("/quizzes/:quizId", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.id, quizId));
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }
    const questions = await db
      .select()
      .from(quizQuestionsTable)
      .where(eq(quizQuestionsTable.quizId, quizId))
      .orderBy(quizQuestionsTable.orderIndex);

    const questionsForFrontend = questions.map((q) => ({
      id: q.id,
      quizId: q.quizId,
      question: q.question,
      options: q.options,
      hint: q.hint ?? undefined,
      orderIndex: q.orderIndex,
    }));
    res.json({ ...quiz, questions: questionsForFrontend });
  } catch (err) {
    req.log.error({ err }, "Error getting quiz");
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

router.post("/quizzes/:quizId/submit", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const { userId, answers } = req.body as {
      userId: string;
      answers: Array<{ questionId: number; selectedOption: number }>;
    };

    const [quiz] = await db.select().from(quizzesTable).where(eq(quizzesTable.id, quizId));
    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    const questions = await db
      .select()
      .from(quizQuestionsTable)
      .where(eq(quizQuestionsTable.quizId, quizId));

    let correctCount = 0;
    const answerFeedback = questions.map((q) => {
      const submitted = answers.find((a) => a.questionId === q.id);
      const correct = submitted?.selectedOption === q.correctOption;
      if (correct) correctCount++;
      return {
        questionId: q.id,
        correct,
        correctOption: q.correctOption,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passingScore;
    const xpEarned = passed ? correctCount * 20 : correctCount * 5;

    await db.insert(quizAttemptsTable).values({
      quizId,
      userId,
      score,
      totalQuestions: questions.length,
      passed: passed ? 1 : 0,
      xpEarned,
    });

    const xpRows = await db.select().from(userXpTable).where(eq(userXpTable.userId, userId));
    if (xpRows.length === 0) {
      await db.insert(userXpTable).values({ userId, totalXp: xpEarned, level: 1 });
    } else {
      const newXp = xpRows[0].totalXp + xpEarned;
      const newLevel = Math.floor(newXp / 200) + 1;
      await db.update(userXpTable).set({ totalXp: newXp, level: newLevel }).where(eq(userXpTable.userId, userId));
    }

    const badgesEarned: typeof badgesTable.$inferSelect[] = [];
    if (passed) {
      const existingBadges = await db
        .select()
        .from(userBadgesTable)
        .where(eq(userBadgesTable.userId, userId));
      const existingBadgeIds = existingBadges.map((b) => b.badgeId);

      if (score === 100 && !existingBadgeIds.includes(1)) {
        const [b] = await db.select().from(badgesTable).where(eq(badgesTable.id, 1));
        if (b) {
          await db.insert(userBadgesTable).values({ userId, badgeId: b.id });
          badgesEarned.push(b);
        }
      }

      const allAttempts = await db
        .select()
        .from(quizAttemptsTable)
        .where(and(eq(quizAttemptsTable.userId, userId), eq(quizAttemptsTable.passed, 1)));
      if (allAttempts.length >= 3 && !existingBadgeIds.includes(3)) {
        const [b] = await db.select().from(badgesTable).where(eq(badgesTable.id, 3));
        if (b) {
          await db.insert(userBadgesTable).values({ userId, badgeId: b.id });
          badgesEarned.push(b);
        }
      }
    }

    res.json({
      quizId,
      userId,
      score,
      totalQuestions: questions.length,
      passed,
      xpEarned,
      badgesEarned,
      answerFeedback,
    });
  } catch (err) {
    req.log.error({ err }, "Error submitting quiz");
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

export default router;
