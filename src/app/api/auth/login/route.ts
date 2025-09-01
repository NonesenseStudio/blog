import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "@/db"; // Drizzle 数据库实例
import { users } from "@/db/schema";
import { eq } from "drizzle-orm"; // 用户表结构

// 用户响应类型定义
interface UserResponse {
  id: string;
  email: string;
  name: string;
}

// 请求体类型定义
interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // 基本验证
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "邮箱和密码不能为空" },
        { status: 400 },
      );
    }

    // 使用 Drizzle 查询用户
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    // 验证用户是否存在
    if (!user) {
      return NextResponse.json(
        { success: false, message: "邮箱或密码不正确" },
        { status: 401 },
      );
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "邮箱或密码不正确" },
        { status: 401 },
      );
    }

    // 准备 JWT payload
    const jwtPayload = {
      userId: user.id,
      email: user.email,
    };

    // 生成 JWT token
    const token = jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET!, // 确保在环境变量中设置
      { expiresIn: "7d" },
    );

    // 准备返回的用户信息（不包含密码）
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // 创建响应并设置Cookie
    const response = NextResponse.json(
      {
        success: true,
        user: userResponse,
      },
      { status: 200 },
    );

    // 设置HttpOnly Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 一周有效期
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("登录错误:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误，请稍后重试" },
      { status: 500 },
    );
  }
}
