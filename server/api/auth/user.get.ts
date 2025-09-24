import { eq } from "drizzle-orm";
import { users } from "~~/server/database/schema/user";
import { useDrizzle } from "~~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
  // 从cookie中获取token（这里我们使用用户ID作为token）
  const token = getCookie(event, "auth_token");

  if (!token) {
    return {
      success: false,
      message: "未登录",
    };
  }

  try {
    // 获取数据库连接
    const db = useDrizzle();

    // 查找用户
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, token))
      .limit(1);

    // 检查用户是否存在
    if (!user || user.length === 0) {
      return {
        success: false,
        message: "用户不存在",
      };
    }

    return {
      success: true,
      user: user[0],
    };
  } catch (error) {
    console.error("获取用户信息错误:", error);
    return {
      success: false,
      message: "获取用户信息失败",
    };
  }
});
