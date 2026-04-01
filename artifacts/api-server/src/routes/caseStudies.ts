import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { caseStudiesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/case-studies", async (req, res) => {
  try {
    const caseStudies = await db.select().from(caseStudiesTable).orderBy(caseStudiesTable.year);
    res.json(caseStudies);
  } catch (err) {
    req.log.error({ err }, "Error listing case studies");
    res.status(500).json({ error: "Failed to fetch case studies" });
  }
});

router.get("/case-studies/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [cs] = await db.select().from(caseStudiesTable).where(eq(caseStudiesTable.slug, slug));
    if (!cs) {
      res.status(404).json({ error: "Case study not found" });
      return;
    }
    res.json(cs);
  } catch (err) {
    req.log.error({ err }, "Error getting case study");
    res.status(500).json({ error: "Failed to fetch case study" });
  }
});

export default router;
