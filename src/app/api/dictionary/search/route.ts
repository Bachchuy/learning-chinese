/**
 * src/app/api/dictionary/search/route.ts
 * API Tra cứu từ điển HSK tốc độ cao.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { words } from "@/server/db/schema";
import { normalizeSearchQuery } from "@/core/search-normalize";
import { or, ilike } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url); // Lấy query parameters từ URL, ví dụ: ?q=你好 hoặc ?query=ni3 hao3
    const q = searchParams.get("q") || searchParams.get("query") || ""; // Lấy từ khóa tìm kiếm từ query parameter "q" hoặc "query"

    // 1. Kiểm tra nếu không có từ khóa
    if (!q || !q.trim()) {
      return NextResponse.json({ results: [] });
    }

    // 2. Chuẩn hóa từ khóa bằng hàm vừa viết
    const normalized = normalizeSearchQuery(q);

    let results = [];

    // 3. Truy vấn Database dựa vào isHanzi
    if (normalized.isHanzi) {
      // TODO: viết truy vấn khi là chữ Hán!
      results = await db.select().from(words).where(ilike(words.hanzi, `%${normalized.trimmed}%`)).limit(20);
    } else {
      // TODO: viết truy vấn khi là chữ Latinh!
        results = await db.select().from(words).where(or(
            ilike(words.pinyinClean, `%${normalized.cleanPinyin}%`),  // Tìm kiếm pinyin không dấu
            ilike(words.pinyin, `%${normalized.cleanPinyin}%`),  // Tìm kiếm cả pinyin có dấu và không dấu
            ilike(words.meaningVi, `%${normalized.trimmed}%`),  // Tìm kiếm nghĩa tiếng Việt
            ilike(words.meaningVi, `%${normalized.cleanVietnamese}%`), // Tìm kiếm nghĩa tiếng Việt đã chuẩn hóa
            ilike(words.hanviet, `%${normalized.cleanVietnamese}%`),  // Tìm kiếm âm Hán-Việt đã chuẩn hóa
            ilike(words.meaningEn, `%${normalized.trimmed}%`),  // Tìm kiếm nghĩa tiếng Anh
        )).limit(20);
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Lỗi API search:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tìm kiếm" },
      { status: 500 }
    );
  }
}