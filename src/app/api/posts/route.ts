import { NextApiRequest, NextApiResponse } from "next";
import { getDbAsync } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateUuid } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const db = await getDbAsync();
    switch (req.method) {
      case "GET":
        // 获取文章列表
        const allPosts = await db.select().from(posts);
        return res.status(200).json(allPosts);

      case "POST":
        // 创建新文章
        const { title, description, content, status, etag, path } = req.body;

        // 验证必要字段
        if (!title || !path) {
          return res.status(400).json({
            error: "标题和路径是必填项",
          });
        }

        // 验证状态
        if (status && !["draft", "published", "archived"].includes(status)) {
          return res.status(400).json({
            error: "无效的状态值",
          });
        }

        // 检查路径是否已存在
        const existingPost = await db
          .select()
          .from(posts)
          .where(eq(posts.path, path))
          .limit(1);

        if (existingPost.length > 0) {
          return res.status(400).json({
            error: "该路径已存在",
          });
        }

        // 创建新文章
        const newPost = await db
          .insert(posts)
          .values({
            id: generateUuid(true),
            title,
            description,
            content,
            status: status || "draft", // 默认为草稿
            etag,
            path,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return res.status(201).json(newPost[0]);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "服务器内部错误",
    });
  }
}
