//?Tại sao cần file này? Vì Drizzle ORM cần một file cấu hình để biết cách kết nối đến cơ sở dữ liệu PostgreSQL, cũng như nơi tìm schema để tạo các migration. File này cũng giúp Drizzle biết được thông tin về dialect (ngôn ngữ truy vấn) và các thông tin xác thực cơ sở dữ liệu.
import { drizzle } from "drizzle-orm/postgres-js";  // Drizzle ORM cho PostgreSQL
import postgres from "postgres";  // Thư viện postgres-js để kết nối PostgreSQL
import * as schema from "./schema"; // Import schema từ file schema.ts
import * as dotenv from "dotenv";   // Thư viện dotenv để nạp biến môi trường từ file .env.local

// Đảm bảo nạp biến môi trường từ .env.local trước khi kết nối
dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is missing in .env.local!");
}

// Đối với Supabase transaction pooler, tắt prefetch (prepare: false)
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });  // Tạo đối tượng db từ Drizzle ORM, sử dụng client và schema đã định nghĩa
