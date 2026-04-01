import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, displayName } = req.body as {
      email: string;
      password: string;
      displayName: string;
    };

    if (!email || !password || !displayName) {
      res.status(400).json({ error: "Email, password and display name are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = randomUUID();

    const [user] = await db.insert(usersTable).values({
      userId,
      email: email.toLowerCase().trim(),
      passwordHash,
      displayName: displayName.trim(),
      role: "student",
    }).returning();

    req.session.userId = user.userId;
    req.session.displayName = user.displayName;

    res.status(201).json({
      id: user.userId,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    req.log.error({ err }, "Error registering user");
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));

    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    await db.update(usersTable).set({ lastActiveAt: new Date() }).where(eq(usersTable.userId, user.userId));

    req.session.userId = user.userId;
    req.session.displayName = user.displayName;

    res.json({
      id: user.userId,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    req.log.error({ err }, "Error logging in");
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/logout", (req, res) => {
  res.clearCookie("infoshield.sid");
  res.clearCookie("connect.sid");
  if (!req.session || !req.session.userId) {
    res.json({ message: "Logged out" });
    return;
  }
  req.session.destroy((err) => {
    if (err) {
      req.log.warn({ err }, "Session destroy warning (non-fatal)");
    }
    res.json({ message: "Logged out" });
  });
});

router.get("/auth/me", async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.userId, req.session.userId));
    if (!user) {
      req.session.destroy(() => {});
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    res.json({
      id: user.userId,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/auth/change-password", async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Current and new passwords are required" });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.userId, req.session.userId));
    if (!user || !user.passwordHash) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }
    const newHash = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.userId, user.userId));
    res.json({ message: "Password updated" });
  } catch (err) {
    req.log.error({ err }, "Error changing password");
    res.status(500).json({ error: "Failed to change password" });
  }
});

export default router;
