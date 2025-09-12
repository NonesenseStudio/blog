import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/db"; // Drizzle 数据库实例
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm"; // 用户表结构

// 用户响应类型定义
interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取 token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "未提供认证令牌" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7); // 去掉 "Bearer " 前缀

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    // 验证用户是否仍然存在
    const db = getDb();
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "用户不存在" },
        { status: 401 },
      );
    }

    // 验证邮箱是否匹配
    if (user.email !== decoded.email) {
      return NextResponse.json(
        { success: false, message: "令牌信息不匹配" },
        { status: 401 },
      );
    }

    // 准备返回的用户信息
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // 返回成功响应
    return NextResponse.json(
      {
        success: true,
        user: userResponse,
      },
      { status: 200 },
    );
  } catch (error) {
    // 处理 JWT 验证错误
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, message: "无效的认证令牌" },
        { status: 401 },
      );
    }

    // 处理 token 过期错误
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { success: false, message: "认证令牌已过期" },
        { status: 401 },
      );
    }

    // 处理其他错误
    console.error("验证令牌错误:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误，请稍后重试" },
      { status: 500 },
    );
  }
}
