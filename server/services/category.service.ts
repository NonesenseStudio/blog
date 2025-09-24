import { useDrizzle } from "~~/server/utils/drizzle";
import { categories } from "~~/server/database/schema";
import { eq, sql, ilike, or, desc } from "drizzle-orm";
import { H3Event } from "h3";

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}

export interface QueryResult {
  list: (typeof categories.$inferSelect)[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// 验证token的辅助函数
const verifyToken = (event: H3Event): boolean => {
  const token = getCookie(event, "auth_token");
  if (!token) {
    throw createError({
      statusCode: 401,
      message: "未授权访问，请先登录",
    });
  }
  // 这里可以添加更多的token验证逻辑
  return true;
};

export const categoryService = {
  async getAll() {
    const db = useDrizzle();
    return db.select().from(categories);
  },

  async getById(id: string) {
    const db = useDrizzle();
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return result[0] || null;
  },

  async create(event: H3Event, data: any) {
    verifyToken(event);
    const db = useDrizzle();
    const result = await db.insert(categories).values(data).returning();
    return result[0];
  },

  async update(event: H3Event, id: string, data: any) {
    verifyToken(event);
    const db = useDrizzle();
    const result = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return result[0] || null;
  },

  async delete(event: H3Event, id: string) {
    verifyToken(event);
    const db = useDrizzle();
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return result[0] || null;
  },

  async query(params: QueryParams = {}): Promise<QueryResult> {
    const db = useDrizzle();
    // 设置默认值
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const search = params.search || "";
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder || "desc";

    // 计算偏移量
    const offset = (page - 1) * pageSize;

    // 构建查询条件
    let whereCondition = undefined;
    if (search) {
      whereCondition = or(
        ilike(categories.name, `%${search}%`),
        ilike(categories.description, `%${search}%`),
      );
    }

    // 构建排序条件
    let orderByCondition;
    if (sortBy === "name") {
      orderByCondition =
        sortOrder === "asc" ? categories.name : desc(categories.name);
    } else {
      orderByCondition =
        sortOrder === "asc" ? categories[sortBy] : desc(categories[sortBy]);
    }

    // 执行查询
    const list = await db
      .select()
      .from(categories)
      .where(whereCondition)
      .orderBy(orderByCondition)
      .limit(pageSize)
      .offset(offset);

    // 获取总数
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(whereCondition);

    const totalCount = totalCountResult[0].count;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      list,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  },
};
