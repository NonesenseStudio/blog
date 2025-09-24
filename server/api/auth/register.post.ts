import { eq } from "drizzle-orm";
import { users } from "~~/server/database/schema/user";
import { useDrizzle } from "~~/server/utils/drizzle";
import { hash } from "argon2";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password } = body;

  // 验证输入
  if (!name || !email || !password) {
    return {
      success: false,
      message: "姓名、邮箱和密码不能为空",
    };
  }

  try {
    // 获取数据库连接
    const db = useDrizzle();

    // 检查邮箱是否已存在
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser && existingUser.length > 0) {
      return {
        success: false,
        message: "该邮箱已被注册",
      };
    }

    // 哈希密码
    const hashedPassword = await hash(password);

    // 创建新用户
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    return {
      success: true,
      message: "注册成功",
      user: newUser[0],
    };
  } catch (error) {
    console.error("注册错误:", error);
    return {
      success: false,
      message: "注册过程中发生错误，请稍后重试",
    };
  }
});
