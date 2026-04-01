import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { badgesTable, userBadgesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

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

router.get("/badges/:badgeId", async (req, res) => {
  try {
    const badgeId = parseInt(req.params.badgeId);
    const [badge] = await db.select().from(badgesTable).where(eq(badgesTable.id, badgeId));
    if (!badge) { res.status(404).json({ error: "Badge not found" }); return; }
    res.json(badge);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch badge" });
  }
});

router.post("/badges", async (req, res) => {
  try {
    const { name, description, icon, requirement } = req.body as {
      name: string;
      description: string;
      icon?: string;
      requirement?: string;
    };
    const [badge] = await db.insert(badgesTable).values({ name, description, icon: icon ?? "shield" }).returning();
    res.status(201).json(badge);
  } catch (err) {
    req.log.error({ err }, "Error creating badge");
    res.status(500).json({ error: "Failed to create badge" });
  }
});

router.put("/badges/:badgeId", async (req, res) => {
  try {
    const badgeId = parseInt(req.params.badgeId);
    const { name, description, icon, requirement } = req.body as { name?: string; description?: string; icon?: string; requirement?: string };
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (icon !== undefined) updates.icon = icon;
    if (requirement !== undefined) updates.requirement = requirement;
    const [badge] = await db.update(badgesTable).set(updates).where(eq(badgesTable.id, badgeId)).returning();
    if (!badge) { res.status(404).json({ error: "Badge not found" }); return; }
    res.json(badge);
  } catch (err) {
    res.status(500).json({ error: "Failed to update badge" });
  }
});

router.delete("/badges/:badgeId", async (req, res) => {
  try {
    const badgeId = parseInt(req.params.badgeId);
    await db.delete(userBadgesTable).where(eq(userBadgesTable.badgeId, badgeId));
    await db.delete(badgesTable).where(eq(badgesTable.id, badgeId));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete badge" });
  }
});

router.get("/user-badges/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const rows = await db.select().from(userBadgesTable).where(eq(userBadgesTable.userId, userId));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user badges" });
  }
});

router.post("/user-badges", async (req, res) => {
  try {
    const { userId, badgeId } = req.body as { userId: string; badgeId: number };
    const existing = await db.select().from(userBadgesTable).where(eq(userBadgesTable.userId, userId));
    if (existing.some((b) => b.badgeId === badgeId)) {
      res.status(409).json({ error: "Badge already awarded" });
      return;
    }
    const [row] = await db.insert(userBadgesTable).values({ userId, badgeId }).returning();
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed to award badge" });
  }
});

router.delete("/user-badges/:userId/:badgeId", async (req, res) => {
  try {
    const { userId, badgeId } = req.params;
    const bid = parseInt(badgeId);
    await db.delete(userBadgesTable).where(and(eq(userBadgesTable.userId, userId), eq(userBadgesTable.badgeId, bid)));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to revoke badge" });
  }
});

export default router;
