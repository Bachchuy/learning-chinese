import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Báo cho Drizzle biết phải lấy cấu hình từ file .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});