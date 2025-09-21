// server/api/db-test.get.ts 或 server/utils/testConnection.ts

import { useDrizzle } from "../utils/drizzle";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const db = useDrizzle();

    // 使用 drizzle 的 sql 方法执行原生 SQL
    const result = await db.run(sql`
          SELECT name
          FROM sqlite_master
          WHERE type='table'
            AND name NOT LIKE 'sqlite_%'
          ORDER BY name
      `);
    return {
      success: true,
      message: "Database connection successful",
      result: result,
    };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return {
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});
