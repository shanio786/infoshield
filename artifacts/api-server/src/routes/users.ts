import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.userId, userId));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    req.log.error({ err }, "Error fetching user");
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const { userId, displayName, email } = req.body as {
      userId: string;
      displayName: string;
      email?: string;
    };

    const existing = await db.select().from(usersTable).where(eq(usersTable.userId, userId));
    if (existing.length > 0) {
      await db
        .update(usersTable)
        .set({ displayName, email: email ?? null, lastActiveAt: new Date() })
        .where(eq(usersTable.userId, userId));
      const [updated] = await db.select().from(usersTable).where(eq(usersTable.userId, userId));
      res.json(updated);
      return;
    }

    const [user] = await db
      .insert(usersTable)
      .values({ userId, displayName, email: email ?? null })
      .returning();
    res.status(201).json(user);
  } catch (err) {
    req.log.error({ err }, "Error creating/updating user");
    res.status(500).json({ error: "Failed to save user" });
  }
});

router.put("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { displayName, email } = req.body as { displayName?: string; email?: string };

    const [user] = await db
      .update(usersTable)
      .set({ ...(displayName ? { displayName } : {}), ...(email !== undefined ? { email } : {}), lastActiveAt: new Date() })
      .where(eq(usersTable.userId, userId))
      .returning();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    req.log.error({ err }, "Error updating user");
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await db.delete(usersTable).where(eq(usersTable.userId, userId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting user");
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
