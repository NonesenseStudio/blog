import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDbAsync();
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, params.id))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    return NextResponse.json(post[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDbAsync();
    const body: {
      title: string;
      description: string;
      content: string;
      status: string;
      etag?: string;
      path?: string;
    } = await request.json();
    const { title, description, content, status, etag, path } = body;

    // 检查文章是否存在
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, params.id))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 如果要更新路径，检查新路径是否已被使用
    if (path && path !== existingPost[0].path) {
      const pathExists = await db
        .select()
        .from(posts)
        .where(eq(posts.path, path))
        .limit(1);

      if (pathExists.length > 0) {
        return NextResponse.json({ error: "该路径已存在" }, { status: 400 });
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
      .where(eq(posts.id, params.id))
      .returning();

    return NextResponse.json(updatedPost[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDbAsync();
    const deleteResult = await db
      .delete(posts)
      .where(eq(posts.id, params.id))
      .returning();

    if (deleteResult.length === 0) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
