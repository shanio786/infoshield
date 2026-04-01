import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { modulesTable, lessonsTable } from "@workspace/db/schema";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/modules", async (req, res) => {
  try {
    const modules = await db.select().from(modulesTable).orderBy(modulesTable.level);
    const result = await Promise.all(
      modules.map(async (mod) => {
        const [lc] = await db
          .select({ count: count() })
          .from(lessonsTable)
          .where(eq(lessonsTable.moduleId, mod.id));
        return {
          ...mod,
          lessonCount: Number(lc?.count ?? 0),
        };
      })
    );
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error listing modules");
    res.status(500).json({ error: "Failed to fetch modules" });
  }
});

router.get("/modules/:moduleId", async (req, res) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const [mod] = await db.select().from(modulesTable).where(eq(modulesTable.id, moduleId));
    if (!mod) {
      res.status(404).json({ error: "Module not found" });
      return;
    }
    const lessons = await db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.moduleId, moduleId))
      .orderBy(lessonsTable.orderIndex);
    res.json({ ...mod, lessons });
  } catch (err) {
    req.log.error({ err }, "Error getting module");
    res.status(500).json({ error: "Failed to fetch module" });
  }
});

router.post("/modules", async (req, res) => {
  try {
    const { title, description, level, icon, estimatedMinutes } = req.body as {
      title: string;
      description: string;
      level?: number;
      icon?: string;
      estimatedMinutes?: number;
    };
    const [mod] = await db
      .insert(modulesTable)
      .values({ title, description, level: level ?? 1, icon: icon ?? "BookOpen", estimatedMinutes: estimatedMinutes ?? 30 })
      .returning();
    res.status(201).json({ ...mod, lessonCount: 0 });
  } catch (err) {
    req.log.error({ err }, "Error creating module");
    res.status(500).json({ error: "Failed to create module" });
  }
});

router.put("/modules/:moduleId", async (req, res) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const { title, description, level, icon, estimatedMinutes } = req.body as {
      title?: string;
      description?: string;
      level?: number;
      icon?: string;
      estimatedMinutes?: number;
    };
    const updates: Partial<typeof modulesTable.$inferInsert> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (level !== undefined) updates.level = level;
    if (icon !== undefined) updates.icon = icon;
    if (estimatedMinutes !== undefined) updates.estimatedMinutes = estimatedMinutes;

    const [mod] = await db
      .update(modulesTable)
      .set(updates)
      .where(eq(modulesTable.id, moduleId))
      .returning();
    if (!mod) {
      res.status(404).json({ error: "Module not found" });
      return;
    }
    res.json(mod);
  } catch (err) {
    req.log.error({ err }, "Error updating module");
    res.status(500).json({ error: "Failed to update module" });
  }
});

router.delete("/modules/:moduleId", async (req, res) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    await db.delete(lessonsTable).where(eq(lessonsTable.moduleId, moduleId));
    await db.delete(modulesTable).where(eq(modulesTable.id, moduleId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting module");
    res.status(500).json({ error: "Failed to delete module" });
  }
});

export default router;
