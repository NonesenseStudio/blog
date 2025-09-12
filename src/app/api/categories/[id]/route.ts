import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z, ZodError } from "zod";

// 更新分类的验证模式
const updateCategorySchema = z.object({
  name: z.string().min(1, "名称不能为空").optional(),
  slug: z.string().min(1, "slug不能为空").optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

const db = getDb();
// 获取单个分类
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, params.id))
      .limit(1);

    if (category.length === 0) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 });
    }

    return NextResponse.json(category[0]);
  } catch (error) {
    return NextResponse.json({ error: "获取分类失败" }, { status: 500 });
  }
}

// 更新分类
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    // 检查分类是否存在
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, params.id))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 });
    }

    // 如果要更新slug，检查新slug是否已被使用
    if (validatedData.slug) {
      const slugExists = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, validatedData.slug))
        .limit(1);

      if (slugExists.length > 0 && slugExists[0].id !== params.id) {
        return NextResponse.json({ error: "该slug已被使用" }, { status: 400 });
      }
    }

    const updatedCategory = await db
      .update(categories)
      .set(validatedData)
      .where(eq(categories.id, params.id))
      .returning();

    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "数据验证失败",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "更新分类失败" }, { status: 500 });
  }
}

// 删除分类
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 检查分类是否存在
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, params.id))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 });
    }

    // 检查是否有子分类
    const hasChildren = await db
      .select()
      .from(categories)
      .where(eq(categories.parentId, params.id))
      .limit(1);

    if (hasChildren.length > 0) {
      return NextResponse.json(
        { error: "请先删除所有子分类" },
        { status: 400 },
      );
    }

    await db.delete(categories).where(eq(categories.id, params.id));

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    return NextResponse.json({ error: "删除分类失败" }, { status: 500 });
  }
}
