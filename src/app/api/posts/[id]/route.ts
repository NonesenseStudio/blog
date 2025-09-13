import { NextApiRequest, NextApiResponse } from "next";
import { getDbAsync } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  try {
    const db = await getDbAsync();
    switch (req.method) {
      case "GET":
        // 获取单篇文章
        const post = await db
          .select()
          .from(posts)
          .where(eq(posts.id, Number(id)))
          .limit(1);

        if (post.length === 0) {
          return res.status(404).json({
            error: "文章不存在",
          });
        }

        return res.status(200).json(post[0]);

      case "PUT":
        // 更新文章
        const { title, description, content, status, etag, path } = req.body;

        // 检查文章是否存在
        const existingPost = await db
          .select()
          .from(posts)
          .where(eq(posts.id, Number(id)))
          .limit(1);

        if (existingPost.length === 0) {
          return res.status(404).json({
            error: "文章不存在",
          });
        }

        // 如果要更新路径，检查新路径是否已被使用
        if (path && path !== existingPost[0].path) {
          const pathExists = await db
            .select()
            .from(posts)
            .where(eq(posts.path, path))
            .limit(1);

          if (pathExists.length > 0) {
            return res.status(400).json({
              error: "该路径已存在",
            });
          }
        }

        // 更新文章
        const updatedPost = await db
          .update(posts)
          .set({
            ...(title && { title }),
            ...(description !== undefined && { description }),
            ...(content !== undefined && { content }),
            ...(status && { status }),
            ...(etag !== undefined && { etag }),
            ...(path && { path }),
            updatedAt: new Date(),
          })
          .where(eq(posts.id, Number(id)))
          .returning();

        return res.status(200).json(updatedPost[0]);

      case "DELETE":
        // 删除文章
        const deleteResult = await db
          .delete(posts)
          .where(eq(posts.id, Number(id)))
          .returning();

        if (deleteResult.length === 0) {
          return res.status(404).json({
            error: "文章不存在",
          });
        }

        return res.status(204).end();

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "服务器内部错误",
    });
  }
}
