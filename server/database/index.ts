// server/utils/database.ts
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema"; // 导入你定义的schema

// 初始化drizzle实例，它接收一个D1Database对象并知道你定义的schema
export const useDrizzle = () => {
  const db = hubDatabase(); // 获取NuxtHub配置的D1数据库绑定
  if (!db) {
    throw new Error("D1 database binding is not available.");
  }
  return drizzle(db, { schema });
};
