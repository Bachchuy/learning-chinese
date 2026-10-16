import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is missing in .env.local");
  process.exit(1);
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

async function runMigration() {
  console.log("⏳ Bắt đầu chạy migrations vào Supabase PostgreSQL...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Chạy migration thành công! Toàn bộ 6 bảng đã sẵn sàng.");
  } catch (error) {
    console.error("❌ Lỗi khi chạy migration:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
