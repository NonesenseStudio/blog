import { NextRequest, NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { and, desc, eq, ilike } from "drizzle-orm";
import { generateUuid } from "@/lib/utils";

// 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const db = await getDbAsync();
    const allPosts = await db.select().from(posts);
    return NextResponse.json(allPosts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

// 创建新文章
export async function POST(request: NextRequest) {
  try {
    const db = await getDbAsync();
    const body: {
      query: boolean;
    } = await request.json();
    const { query } = body;
    if (query) {
      return handleQuery(db, body);
    } else {
      return handleCreate(db, body);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

// 处理查询操作
async function handleQuery(db: any, body: any) {
  const {
    page = 1,
    limit = 10,
    title = "",
    status,
    orderBy = "createdAt",
    order = "desc",
  } = body;

  // 验证参数
  if (page < 1 || limit < 1) {
    return NextResponse.json(
      { error: "页码和每页条数必须大于0" },
      { status: 400 },
    );
  }

  // 计算偏移量
  const offset = (page - 1) * limit;

  // 构建查询条件
  let whereCondition = undefined;
  const conditions = [];

  // 如果有标题搜索条件
  if (title) {
    conditions.push(ilike(posts.title, `%${title}%`));
  }

  // 如果有状态筛选条件
  if (status && ["draft", "published", "archived"].includes(status)) {
    conditions.push(eq(posts.status, status));
  }

  // 组合所有条件
  if (conditions.length > 0) {
    whereCondition = and(...conditions);
  }

  // 构建排序条件
  let orderByCondition;
  switch (orderBy) {
    case "title":
      orderByCondition = order === "asc" ? posts.title : desc(posts.title);
      break;
    case "status":
      orderByCondition = order === "asc" ? posts.status : desc(posts.status);
      break;
    case "createdAt":
    default:
      orderByCondition =
        order === "asc" ? posts.createdAt : desc(posts.createdAt);
  }

  // 获取总数
  const totalCount = await db
    .select({ count: posts.id })
    .from(posts)
    .where(whereCondition);

  // 获取分页数据
  const postsList = await db
    .select()
    .from(posts)
    .where(whereCondition)
    .orderBy(orderByCondition)
    .limit(limit)
    .offset(offset);

  // 返回分页数据
  return NextResponse.json({
    data: postsList,
    pagination: {
      total: totalCount.length,
      page,
      limit,
      totalPages: Math.ceil(totalCount.length / limit),
    },
  });
}

// 处理创建操作
async function handleCreate(db: any, body: any) {
  const { title, description, content, status, etag, path } = body;

  // 验证必要字段
  if (!title) {
    return NextResponse.json({ error: "标题和路径是必填项" }, { status: 400 });
  }

  // 验证状态
  if (status && !["draft", "published", "archived"].includes(status)) {
    return NextResponse.json({ error: "无效的状态值" }, { status: 400 });
  }

  // 检查路径是否已存在
  // const existingPost = await db
  //   .select()
  //   .from(posts)
  //   .where(eq(posts.path, path))
  //   .limit(1);
  //
  // if (existingPost.length > 0) {
  //   return NextResponse.json({ error: "该路径已存在" }, { status: 400 });
  // }

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
      createdAt: new Date().valueOf(),
      updatedAt: new Date().valueOf(),
    })
    .returning();

  return NextResponse.json(newPost[0], { status: 201 });
}
