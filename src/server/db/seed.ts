import { db } from "./index";
import { words, decks, deckCards } from "./schema";
import { HSK1_WORDS } from "./hsk1-data";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  console.log("🌱 Bắt đầu nạp dữ liệu HSK 1 vào cơ sở dữ liệu...");

  try {
    // 1. Tạo hoặc lấy Bộ thẻ hệ thống HSK 1
    const systemDeck = await db  //truoc do la let systemDeck = await db
      .select()
      .from(decks)
      .where(eq(decks.isSystem, true))
      .limit(1);

    let systemDeckId: string;

    if (systemDeck.length === 0) {
      console.log("📦 Tạo Bộ thẻ hệ thống: 'HSK 2.0 Cấp độ 1'...");
      const [insertedDeck] = await db
        .insert(decks)
        .values({
          name: "HSK 2.0 Cấp độ 1",
          description: "150 từ vựng cốt lõi tiếng Trung HSK cấp 1 kèm Âm Hán-Việt chuẩn.",
          isSystem: true,
          userId: null,
        })
        .returning();
      systemDeckId = insertedDeck.id;
      console.log("✅ Đã tạo bộ thẻ hệ thống với ID:", systemDeckId);
    } else {
      systemDeckId = systemDeck[0].id;
      console.log("ℹ️ Bộ thẻ hệ thống đã tồn tại với ID:", systemDeckId);
    }

    // 2. Nạp từ vựng vào bảng words
    console.log(`📚 Đang nạp ${HSK1_WORDS.length} từ vựng HSK 1...`);

    for (const item of HSK1_WORDS) {
      // Kiểm tra xem từ đã có chưa theo hanzi + pinyin
      const existing = await db
        .select()
        .from(words)
        .where(eq(words.hanzi, item.hanzi))
        .limit(1);

      let wordId: number;

      if (existing.length === 0) {
        const [insertedWord] = await db
          .insert(words)
          .values({
            hanzi: item.hanzi,
            traditional: item.traditional || null,
            pinyin: item.pinyin,
            pinyinClean: item.pinyinClean.toLowerCase(),
            hanviet: item.hanviet.toUpperCase(),
            meaningVi: item.meaningVi,
            meaningEn: item.meaningEn || null,
            partsOfSpeech: item.partsOfSpeech || null,
            hskLevel: item.hskLevel,
            exampleHanzi: item.exampleHanzi || null,
            examplePinyin: item.examplePinyin || null,
            exampleVi: item.exampleVi || null,
          })
          .returning();
        wordId = insertedWord.id;
      } else {
        wordId = existing[0].id;
      }

      // 3. Liên kết từ vào bộ thẻ hệ thống
      await db
        .insert(deckCards)
        .values({
          deckId: systemDeckId,
          wordId: wordId,
        })
        .onConflictDoNothing();
    }

    const totalWords = await db.select().from(words);
    const totalCardsInDeck = await db
      .select()
      .from(deckCards)
      .where(eq(deckCards.deckId, systemDeckId));

    console.log(`🎉 HOÀN THÀNH SEED DỮ LIỆU!`);
    console.log(`- Tổng số từ vựng trong DB: ${totalWords.length}`);
    console.log(`- Tổng số thẻ trong bộ HSK 1: ${totalCardsInDeck.length}`);
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
