import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { baseColumns } from "./core";

export const users = sqliteTable("users", {
  ...baseColumns,
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});
