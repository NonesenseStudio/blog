import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db"; // 假设这是你的数据库连接实例
import { users } from "@/lib/db/schema"; // 用户表schema
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";

// 定义输入验证schema
const registerSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  email: z.email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少需要6个字符"),
});

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    // 解析请求体
    const body = await request.json();

    // 验证输入
    const validatedData = registerSchema.parse(body);
    const { name, email, password } = validatedData;

    // 检查邮箱是否已存在
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: "该邮箱已被注册" },
        { status: 400 },
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    // 返回成功响应（不包含密码）
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json(
      {
        success: true,
        message: "注册成功",
        user: userWithoutPassword,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      // 处理验证错误 - 使用 error.issues 而不是 error.errors
      return NextResponse.json(
        {
          success: false,
          message: "输入数据验证失败",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    console.error("注册错误:", error);
    return NextResponse.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 },
    );
  }
}
