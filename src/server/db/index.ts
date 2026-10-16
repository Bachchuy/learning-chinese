import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

// Đảm bảo nạp biến môi trường từ .env.local trước khi kết nối
dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is missing in .env.local!");
}

// Đối với Supabase transaction pooler, tắt prefetch (prepare: false)
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
