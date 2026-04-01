import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { forumPostsTable, forumRepliesTable } from "@workspace/db/schema";
import { eq, desc, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/forum/posts", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const posts = await db
      .select()
      .from(forumPostsTable)
      .orderBy(desc(forumPostsTable.createdAt))
      .limit(limit)
      .offset(offset);

    const result = await Promise.all(
      posts.map(async (post) => {
        const [rc] = await db
          .select({ count: count() })
          .from(forumRepliesTable)
          .where(eq(forumRepliesTable.postId, post.id));
        return { ...post, replyCount: Number(rc?.count ?? 0) };
      })
    );
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error listing forum posts");
    res.status(500).json({ error: "Failed to fetch forum posts" });
  }
});

router.post("/forum/posts", async (req, res) => {
  try {
    const { authorName, userId, title, content } = req.body as {
      authorName: string;
      userId: string;
      title: string;
      content: string;
    };
    const [post] = await db
      .insert(forumPostsTable)
      .values({ authorName, userId, title, content })
      .returning();
    res.status(201).json({ ...post, replyCount: 0 });
  } catch (err) {
    req.log.error({ err }, "Error creating forum post");
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.get("/forum/posts/:postId", async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const [post] = await db.select().from(forumPostsTable).where(eq(forumPostsTable.id, postId));
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    const replies = await db
      .select()
      .from(forumRepliesTable)
      .where(eq(forumRepliesTable.postId, postId))
      .orderBy(forumRepliesTable.createdAt);
    res.json({ ...post, replies });
  } catch (err) {
    req.log.error({ err }, "Error getting forum post");
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.post("/forum/posts/:postId/replies", async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const { authorName, userId, content } = req.body as {
      authorName: string;
      userId: string;
      content: string;
    };
    const [reply] = await db
      .insert(forumRepliesTable)
      .values({ postId, authorName, userId, content })
      .returning();
    res.status(201).json(reply);
  } catch (err) {
    req.log.error({ err }, "Error creating forum reply");
    res.status(500).json({ error: "Failed to create reply" });
  }
});

export default router;
