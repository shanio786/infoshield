import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function formatUser(row: typeof usersTable.$inferSelect) {
  return {
    id: row.userId,
    displayName: row.displayName,
    email: row.email ?? undefined,
    avatarUrl: undefined,
    createdAt: row.createdAt,
  };
}

router.get("/users", async (_req, res) => {
  try {
    const users = await db.select().from(usersTable);
    res.json(users.map(formatUser));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.userId, userId));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(formatUser(user));
  } catch (err) {
    req.log.error({ err }, "Error fetching user");
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const body = req.body as { id?: string; displayName: string; email?: string };
    const userId = body.id;
    if (!userId) {
      res.status(400).json({ error: "id is required" });
      return;
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.userId, userId));
    if (existing.length > 0) {
      await db
        .update(usersTable)
        .set({ displayName: body.displayName, email: body.email ?? null, lastActiveAt: new Date() })
        .where(eq(usersTable.userId, userId));
      const [updated] = await db.select().from(usersTable).where(eq(usersTable.userId, userId));
      res.json(formatUser(updated));
      return;
    }

    const [user] = await db
      .insert(usersTable)
      .values({ userId, displayName: body.displayName, email: body.email ?? null })
      .returning();
    res.status(201).json(formatUser(user));
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
    res.json(formatUser(user));
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
