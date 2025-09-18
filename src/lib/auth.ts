import jwt from "jsonwebtoken";
import { compare, hash } from "bcryptjs";
import { getDbAsync } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 生成 JWT
export function signToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// 验证 JWT
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch (error) {
    return null;
  }
}

// 哈希密码
export async function hashPassword(password: string) {
  return hash(password, 12);
}

// 验证密码
export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

// 获取当前用户
export async function getCurrentUser(token: string) {
  const payload = verifyToken(token);
  if (!payload) return null;
  const db = await getDbAsync();
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.id))
    .limit(1);

  return user[0] || null;
}

// 注册用户
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const hashedPassword = await hashPassword(data.password);

  const db = await getDbAsync();
  const newUser = await db
    .insert(users)
    .values({
      id: nanoid(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })
    .returning();

  return newUser[0];
}

// 登录用户
export async function loginUser(email: string, password: string) {
  const db = await getDbAsync();
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    throw new Error("用户不存在");
  }

  const isValidPassword = await verifyPassword(
    password,
    user[0].password || "",
  );
  if (!isValidPassword) {
    throw new Error("密码错误");
  }

  const token = signToken({ id: user[0].id, email: user[0].email });

  return {
    user: {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
    },
    token,
  };
}
