import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite", // 'mysql' | 'sqlite' | 'turso'
  schema: "./src/db/schema/*.ts",
  out: "./src/db/migrations",
  driver: "d1-http",
  dbCredentials: {
    accountId: "73686fbc2d06ec6bad8bbfe9efe5b5e8",
    databaseId: "79f6b956-7a4a-42df-a669-9d6708068958",
    token: "K5ZCS3O57SgJTCCFI9H6sKVlSeys2O81e_wFXfK7",
  },
});
