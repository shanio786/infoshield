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

export default router;
