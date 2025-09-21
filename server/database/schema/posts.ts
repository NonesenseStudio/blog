import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { baseColumns } from "./core";

export const posts = sqliteTable("posts", {
  ...baseColumns,
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  status: text("status", { enum: ["draft", "published", "archived"] }).default(
    "draft",
  ),
  etag: text("r2_etag"),
  path: text("r2_path").unique(),
});

export const categories = sqliteTable("categories", {
  ...baseColumns,
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: text("parent_id"),
});

export const postCategories = sqliteTable("post_categories", {
  postId: text("post_id").references(() => posts.id, {
    onDelete: "cascade",
  }),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),
});
