import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { baseColumns } from "@/db/schema/core";

export const posts = sqliteTable("posts", {
  ...baseColumns,
  title: text("name").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  status: text("status", { enum: ["draft", "published", "archived"] }).default(
    "draft",
  ),
  etag: text("r2_etag"),
  path: text("r2_path").notNull().unique(),
});

export const categories = sqliteTable("categories", {
  ...baseColumns,
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: text("parent_id"),
});

export const postCategories = sqliteTable("post_categories", {
  postId: integer("post_id").references(() => posts.id, {
    onDelete: "cascade",
  }),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),
});
