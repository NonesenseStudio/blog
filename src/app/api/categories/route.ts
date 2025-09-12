import { NextRequest, NextResponse } from "next/server";
import {  getDbAsync } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, or, ilike, and, count, desc, asc } from "drizzle-orm";
import { z, ZodError } from "zod";

// 创建分类的验证模式
const createCategorySchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  slug: z.string().min(1, "slug不能为空"),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

// 查询分类的验证模式
const queryCategoriesSchema = z.object({
  query: z.boolean().default(true),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  keyword: z.string().optional(),
  sortBy: z
    .enum(["name", "slug", "createdAt", "updatedAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  parentId: z.string().optional(),
});

// 定义请求体类型
type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
type QueryCategoriesRequest = z.infer<typeof queryCategoriesSchema>;
type CategoryRequest = CreateCategoryRequest | QueryCategoriesRequest;
// 获取所有分类
export async function GET() {
  try {
    const db = await getDbAsync();
    const allCategories = await db.select().from(categories);
    return NextResponse.json(allCategories);
  } catch (error) {
    return NextResponse.json({ error: "获取分类列表失败" }, { status: 500 });
  }
}

// 创建新分类或查询分类
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CategoryRequest;
    const db = await getDbAsync();
    // 判断是创建分类还是查询分类
    if ("query" in body && body.query) {
      // 查询分类
      const queryData = queryCategoriesSchema.parse(body);

      // 构建查询条件
      const whereConditions = [];

      if (queryData.keyword) {
        whereConditions.push(
          or(
            ilike(categories.name, `%${queryData.keyword}%`),
            ilike(categories.slug, `%${queryData.keyword}%`),
            ilike(categories.description, `%${queryData.keyword}%`),
          ),
        );
      }

      if (queryData.parentId !== undefined) {
        whereConditions.push(
          queryData.parentId
            ? eq(categories.parentId, queryData.parentId)
            : eq(categories.parentId, ""),
        );
      }

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // 获取总数
      const [totalCount] = await db
        .select({ count: count() })
        .from(categories)
        .where(whereClause);

      // 构建排序
      const orderBy =
        queryData.sortOrder === "desc"
          ? desc(categories[queryData.sortBy])
          : asc(categories[queryData.sortBy]);

      // 获取分页数据
      const offset = (queryData.page - 1) * queryData.pageSize;
      const categoryList = await db
        .select()
        .from(categories)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(queryData.pageSize)
        .offset(offset);

      return NextResponse.json({
        data: categoryList,
        pagination: {
          page: queryData.page,
          pageSize: queryData.pageSize,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / queryData.pageSize),
        },
      });
    } else {
      // 创建分类
      const validatedData = createCategorySchema.parse(body);

      // 检查slug是否已存在
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, validatedData.slug))
        .limit(1);

      if (existingCategory.length > 0) {
        return NextResponse.json({ error: "该slug已存在" }, { status: 400 });
      }

      const newCategory = await db
        .insert(categories)
        .values(validatedData)
        .returning();

      return NextResponse.json(newCategory[0], { status: 201 });
    }
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "操作失败" },
      { status: 500 },
    );
  }
}
