import { eq } from "drizzle-orm";
import { users } from "~~/server/database/schema/user";
import { useDrizzle } from "~~/server/utils/drizzle";
import { verify } from "argon2";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  // 验证输入
  if (!email || !password) {
    return {
      success: false,
      message: "邮箱和密码不能为空",
    };
  }

  try {
    // 获取数据库连接
    const db = useDrizzle();

    // 查找用户
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // 检查用户是否存在
    if (!user || user.length === 0) {
      return {
        success: false,
        message: "邮箱或密码不正确",
      };
    }

    const userData = user[0];

    // 验证密码
    const validPassword = await verify(userData.password, password);

    if (!validPassword) {
      return {
        success: false,
        message: "邮箱或密码不正确",
      };
    }

    // 创建用户对象（不包含密码）
    const safeUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };

    // 设置cookie
    setCookie(event, "auth_token", userData.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1周
    });

    // 返回用户信息
    return {
      success: true,
      user: safeUser,
    };
  } catch (error) {
    console.error("登录错误:", error);
    return {
      success: false,
      message: "登录过程中发生错误，请稍后重试",
    };
  }
});
