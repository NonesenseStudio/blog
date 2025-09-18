import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { posts, postCategories, categories } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

// 定义状态类型
type PostStatus = "draft" | "published" | "archived";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // 解析 params Promise
    const db = await getDbAsync();
    const post = await db.select().from(posts).where(eq(posts.id, id)).limit(1);

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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // 解析 params Promise
    const db = await getDbAsync();
    const body: {
      title: string;
      description: string;
      content: string;
      status: PostStatus; // 使用定义的状态类型
      etag?: string;
      path?: string;
    } = await request.json();
    const { title, description, content, status, etag, path } = body;

    // 检查文章是否存在
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
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
        ...(status && { status: status as PostStatus }), // 确保状态是正确的类型
        ...(etag !== undefined && { etag }),
        ...(path && { path }),
        updatedAt: new Date().getTime(), // 使用 Date 对象而不是时间戳
      })
      .where(eq(posts.id, id))
      .returning();

    return NextResponse.json(updatedPost[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // 解析 params Promise
    const db = await getDbAsync();
    const deleteResult = await db
      .delete(posts)
      .where(eq(posts.id, id))
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

// 新增：绑定文章和分类的接口
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // 解析 params Promise
    const db = await getDbAsync();
    const body: {
      categoryIds: string[]; // 要绑定的分类ID数组
    } = await request.json();
    const { categoryIds } = body;

    // 验证输入
    if (
      !categoryIds ||
      !Array.isArray(categoryIds) ||
      categoryIds.length === 0
    ) {
      return NextResponse.json(
        { error: "请提供有效的分类ID数组" },
        { status: 400 },
      );
    }

    // 检查文章是否存在
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 检查所有分类是否存在
    const existingCategories = await db
      .select()
      .from(categories)
      .where(inArray(categories.id, categoryIds));

    if (existingCategories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: "一个或多个分类不存在" },
        { status: 404 },
      );
    }

    // 删除现有的所有分类绑定
    await db.delete(postCategories).where(eq(postCategories.postId, id));

    // 创建新的分类绑定
    const newBindings = categoryIds.map((categoryId) => ({
      postId: id,
      categoryId,
    }));

    const insertedBindings = await db
      .insert(postCategories)
      .values(newBindings)
      .returning();

    return NextResponse.json(insertedBindings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
