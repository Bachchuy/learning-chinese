import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { words } from "@/server/db/schema";
import { normalizeSearchQuery } from "@/core/search-normalize";
import { or, ilike } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || searchParams.get("query") || "";
    const mode = searchParams.get("mode") || "all";

    if (!q || !q.trim()) {
      return NextResponse.json({ results: [] });
    }

    const normalized = normalizeSearchQuery(q);

    // Xử lý Pinyin không dấu cách (biến "ni hao" -> "nihao")
    const pinyinNoSpace = normalized.cleanPinyin.replace(/\s+/g, "");

    let results = [];

    // 1. Chế độ CHỈ TRA TRUNG -> VIỆT (Chữ Hán & Pinyin)
    if (mode === "zh-vi") {
      if (normalized.isHanzi) {
        results = await db
          .select()
          .from(words)
          .where(ilike(words.hanzi, `%${normalized.trimmed}%`))
          .limit(20);
      } else {
        results = await db
          .select()
          .from(words)
          .where(
            or(
              ilike(words.pinyinClean, `%${normalized.cleanPinyin}%`),
              ilike(words.pinyinClean, `%${pinyinNoSpace}%`),
              ilike(words.pinyin, `%${normalized.cleanPinyin}%`)
            )
          )
          .limit(20);
      }
    } 
    // 2. Chế độ CHỈ TRA VIỆT -> TRUNG (Nghĩa tiếng Việt & Âm Hán-Việt)
    else if (mode === "vi-zh") {
      results = await db
        .select()
        .from(words)
        .where(
          or(
            ilike(words.meaningVi, `%${normalized.trimmed}%`),
            ilike(words.meaningVi, `%${normalized.cleanVietnamese}%`),
            ilike(words.hanviet, `%${normalized.cleanVietnamese}%`)
          )
        )
        .limit(20);
    } 
    // 3. Chế độ TẤT CẢ (Tìm kiếm thông minh hỗn hợp)
    else {
      if (normalized.isHanzi) {
        results = await db
          .select()
          .from(words)
          .where(ilike(words.hanzi, `%${normalized.trimmed}%`))
          .limit(20);
      } else {
        results = await db
          .select()
          .from(words)
          .where(
            or(
              ilike(words.pinyinClean, `%${normalized.cleanPinyin}%`),
              ilike(words.pinyinClean, `%${pinyinNoSpace}%`), // Thêm dòng này để khớp "ni hao" với "nihao"
              ilike(words.pinyin, `%${normalized.cleanPinyin}%`),
              ilike(words.meaningVi, `%${normalized.trimmed}%`),
              ilike(words.meaningVi, `%${normalized.cleanVietnamese}%`),
              ilike(words.hanviet, `%${normalized.cleanVietnamese}%`)
            )
          )
          .limit(20);
      }
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