// src/app/api/d1/route.ts
import { NextResponse } from "next/server";
import { getDb, getDbAsync } from "@/db";
// 模拟数据
const mockData = [
  { id: 1, name: "Example 1" },
  { id: 2, name: "Example 2" },
  { id: 3, name: "Example 3" },
];

export async function GET() {
  try {
    // 本地开发使用模拟数据
    if (process.env.NODE_ENV === "development") {
      const db = getDb();
      const asyncDb = await getDbAsync();
      return NextResponse.json({ mockData, db, asyncDb });
    }

    // 生产环境中使用 D1
    const { DB } = process.env as unknown as { DB: any };
    if (!DB) {
      throw new Error("D1 database binding not found");
    }

    const { results } = await DB.prepare("SELECT * FROM your_table").all();

    return NextResponse.json(results);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to query database" },
      { status: 500 },
    );
  }
}
