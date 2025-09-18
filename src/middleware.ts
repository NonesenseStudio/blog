import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 获取当前路径
  const { pathname } = request.nextUrl;

  // 只对 dashboard 下的路径进行验证
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token")?.value;

    // 如果没有 token，重定向到登录页
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 验证 token 是否有效（这里需要根据你的实际验证逻辑来实现）
    try {
      // const isValidToken = await verifyToken(token);
      // if (!isValidToken) {
      //   throw new Error('Invalid token');
      // }
      return NextResponse.next();
    } catch (error) {
      // 如果 token 无效，清除 cookie 并重定向到登录页
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // 其他路径直接通过
  return NextResponse.next();
}

// 配置中间件运行的路径
export const config = {
  matcher: [
    /*
     * 只匹配 dashboard 下的路径
     */
    "/dashboard/:path*",
  ],
};
