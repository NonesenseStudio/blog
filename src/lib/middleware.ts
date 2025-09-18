import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function withAuth(request: NextRequest) {
  // 从 cookie 中获取 token
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "未授权，请先登录" }, { status: 401 });
  }

  const user = await getCurrentUser(token);

  if (!user) {
    return NextResponse.json(
      { error: "无效的令牌，请重新登录" },
      { status: 401 },
    );
  }

  // 将用户信息添加到请求中
  const requestWithUser = request.clone();
  (requestWithUser as any).user = user;

  return { user, request: requestWithUser };
}
