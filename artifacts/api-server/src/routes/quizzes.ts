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
          existingBadgeIds.push(b.id);
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
          existingBadgeIds.push(b.id);
        }
      }

      const highScoreAttempts = await db
        .select()
        .from(quizAttemptsTable)
        .where(eq(quizAttemptsTable.userId, userId));
      const ninetyPlusCount = highScoreAttempts.filter((a) => a.score >= 90).length;
      if (ninetyPlusCount >= 2 && !existingBadgeIds.includes(7)) {
        const [b] = await db.select().from(badgesTable).where(eq(badgesTable.id, 7));
        if (b) {
          await db.insert(userBadgesTable).values({ userId, badgeId: b.id });
          badgesEarned.push(b);
          existingBadgeIds.push(b.id);
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

router.post("/quizzes", async (req, res) => {
  try {
    const { moduleId, title, description, passingScore } = req.body as {
      moduleId: number;
      title: string;
      description?: string;
      passingScore?: number;
    };
    const [quiz] = await db
      .insert(quizzesTable)
      .values({ moduleId, title, description: description ?? "", passingScore: passingScore ?? 70 })
      .returning();
    res.status(201).json(quiz);
  } catch (err) {
    req.log.error({ err }, "Error creating quiz");
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

router.put("/quizzes/:quizId", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const { title, description, passingScore } = req.body as { title?: string; description?: string; passingScore?: number };
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (passingScore !== undefined) updates.passingScore = passingScore;
    const [quiz] = await db.update(quizzesTable).set(updates).where(eq(quizzesTable.id, quizId)).returning();
    if (!quiz) { res.status(404).json({ error: "Quiz not found" }); return; }
    res.json(quiz);
  } catch (err) {
    req.log.error({ err }, "Error updating quiz");
    res.status(500).json({ error: "Failed to update quiz" });
  }
});

router.delete("/quizzes/:quizId", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    await db.delete(quizAttemptsTable).where(eq(quizAttemptsTable.quizId, quizId));
    await db.delete(quizQuestionsTable).where(eq(quizQuestionsTable.quizId, quizId));
    await db.delete(quizzesTable).where(eq(quizzesTable.id, quizId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting quiz");
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});

router.get("/quizzes/:quizId/questions", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const questions = await db.select().from(quizQuestionsTable).where(eq(quizQuestionsTable.quizId, quizId)).orderBy(quizQuestionsTable.orderIndex);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

router.post("/quizzes/:quizId/questions", async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const { question, options, correctOption, hint, orderIndex } = req.body as {
      question: string;
      options: string[];
      correctOption: number;
      hint?: string;
      orderIndex?: number;
    };
    const [q] = await db.insert(quizQuestionsTable).values({ quizId, question, options, correctOption, hint: hint ?? null, orderIndex: orderIndex ?? 0 }).returning();
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ error: "Failed to create question" });
  }
});

router.put("/quizzes/:quizId/questions/:questionId", async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const { question, options, correctOption, hint, orderIndex } = req.body as { question?: string; options?: string[]; correctOption?: number; hint?: string; orderIndex?: number };
    const updates: Record<string, unknown> = {};
    if (question !== undefined) updates.question = question;
    if (options !== undefined) updates.options = options;
    if (correctOption !== undefined) updates.correctOption = correctOption;
    if (hint !== undefined) updates.hint = hint;
    if (orderIndex !== undefined) updates.orderIndex = orderIndex;
    const [q] = await db.update(quizQuestionsTable).set(updates).where(eq(quizQuestionsTable.id, questionId)).returning();
    if (!q) { res.status(404).json({ error: "Question not found" }); return; }
    res.json(q);
  } catch (err) {
    res.status(500).json({ error: "Failed to update question" });
  }
});

router.delete("/quizzes/:quizId/questions/:questionId", async (req, res) => {
  try {
    const questionId = parseInt(req.params.questionId);
    await db.delete(quizQuestionsTable).where(eq(quizQuestionsTable.id, questionId));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete question" });
  }
});

router.get("/quizzes/attempts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const attempts = await db.select().from(quizAttemptsTable).where(eq(quizAttemptsTable.userId, userId));
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
});

router.delete("/quizzes/attempts/record/:attemptId", async (req, res) => {
  try {
    const attemptId = parseInt(req.params.attemptId);
    await db.delete(quizAttemptsTable).where(eq(quizAttemptsTable.id, attemptId));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete attempt" });
  }
});

export default router;
