import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { badgesTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/badges", async (req, res) => {
  try {
    const badges = await db.select().from(badgesTable).orderBy(badgesTable.id);
    res.json(badges);
  } catch (err) {
    req.log.error({ err }, "Error listing badges");
    res.status(500).json({ error: "Failed to fetch badges" });
  }
});

export default router;
