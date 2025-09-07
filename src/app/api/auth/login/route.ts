import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { getEnv } from "@/lib/env";

// 定义输入验证schema
const loginSchema = z.object({
  email: z.email("请输入有效的邮箱地址"),
  password: z.string().min(1, "密码不能为空"),
});

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const env: any = getEnv();
    console.log(env);
    // 解析请求体
    const body = await request.json();

    // 验证输入
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // 查找用户
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { success: false, message: "邮箱或密码不正确" },
        { status: 401 },
      );
    }

    const user = existingUser[0];

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "邮箱或密码不正确" },
        { status: 401 },
      );
    }

    // 生成 JWT 令牌
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 返回成功响应（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "登录成功",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 处理验证错误
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
    console.error("登录错误:", error);
    return NextResponse.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 },
    );
  }
}
