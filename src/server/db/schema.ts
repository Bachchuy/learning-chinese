import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
  real,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// 1. BẢNG USERS (Đồng bộ từ Supabase Auth)
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Supabase Auth User UUID
  email: text("email").unique().notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. BẢNG WORDS (Kho từ vựng HSK & Từ điển)
export const words = pgTable(
  "words",
  {
    id: serial("id").primaryKey(),
    hanzi: text("hanzi").notNull(), // Chữ Hán giản thể (ví dụ: 学生)
    traditional: text("traditional"), // Chữ Hán phồn thể (ví dụ: 學生)
    pinyin: text("pinyin").notNull(), // Pinyin có thanh điệu (ví dụ: xuésheng)
    pinyinClean: text("pinyin_clean").notNull(), // Pinyin không dấu/số phục vụ search (ví dụ: xuesheng)
    hanviet: text("hanviet").notNull(), // Âm Hán-Việt in hoa (ví dụ: HỌC SINH)
    meaningVi: text("meaning_vi").notNull(), // Nghĩa tiếng Việt chính
    meaningEn: text("meaning_en"), // Nghĩa tiếng Anh CC-CEDICT dự phòng
    partsOfSpeech: text("parts_of_speech"), // Từ loại: danh từ, động từ...
    hskLevel: integer("hsk_level").default(1).notNull(), // Mặc định 1 cho HSK 1
    exampleHanzi: text("example_hanzi"), // Câu ví dụ chữ Hán
    examplePinyin: text("example_pinyin"), // Câu ví dụ Pinyin
    exampleVi: text("example_vi"), // Câu ví dụ dịch tiếng Việt
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("words_hanzi_idx").on(table.hanzi),
    index("words_pinyin_clean_idx").on(table.pinyinClean),
    index("words_hanviet_idx").on(table.hanviet),
    index("words_hsk_level_idx").on(table.hskLevel),
  ]
);

// 3. BẢNG DECKS (Bộ thẻ học tập)
export const decks = pgTable("decks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"), // null đối với bộ HSK 1 hệ thống, có ID với bộ thẻ cá nhân
  name: text("name").notNull(), // Tên bộ thẻ (ví dụ: "HSK 2.0 Cấp độ 1")
  description: text("description"), // Mô tả ngắn
  isSystem: boolean("is_system").default(false).notNull(), // true: Bộ chỉ đọc của hệ thống
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. BẢNG DECK_CARDS (Liên kết từ vựng vào bộ thẻ)
export const deckCards = pgTable(
  "deck_cards",
  {
    id: serial("id").primaryKey(),
    deckId: uuid("deck_id")
      .references(() => decks.id, { onDelete: "cascade" })
      .notNull(),
    wordId: integer("word_id")
      .references(() => words.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("deck_cards_deck_word_idx").on(table.deckId, table.wordId),
  ]
);

// 5. BẢNG CARD_STATES (Trạng thái trí nhớ FSRS của từng người dùng với từng từ)
export const cardStates = pgTable(
  "card_states",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    wordId: integer("word_id")
      .references(() => words.id, { onDelete: "cascade" })
      .notNull(),
    // FSRS State: 0 = New, 1 = Learning, 2 = Review, 3 = Relearning
    state: integer("state").default(0).notNull(),
    due: timestamp("due").defaultNow().notNull(), // Thời điểm đến hạn ôn tiếp theo
    stability: real("stability").default(0).notNull(), // Độ bền trí nhớ (FSRS S)
    difficulty: real("difficulty").default(0).notNull(), // Độ khó của từ (FSRS D)
    elapsedDays: integer("elapsed_days").default(0).notNull(),
    scheduledDays: integer("scheduled_days").default(0).notNull(),
    reps: integer("reps").default(0).notNull(), // Số lần đã ôn
    lapses: integer("lapses").default(0).notNull(), // Số lần quên
    lastReview: timestamp("last_review"), // Lần ôn gần nhất
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("card_states_user_word_idx").on(table.userId, table.wordId),
    index("card_states_due_idx").on(table.userId, table.due),
  ]
);

// 6. BẢNG REVIEW_LOGS (Lịch sử ôn tập chi tiết của FSRS)
export const reviewLogs = pgTable("review_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  wordId: integer("word_id")
    .references(() => words.id, { onDelete: "cascade" })
    .notNull(),
  deckId: uuid("deck_id").references(() => decks.id, { onDelete: "set null" }),
  grade: integer("grade").notNull(), // 1: Again (Lại), 2: Hard (Khó), 3: Good (Tốt), 4: Easy (Dễ)
  state: integer("state").notNull(), // Trạng thái trước khi chấm
  due: timestamp("due").notNull(), // Hạn cũ
  stability: real("stability").notNull(),
  difficulty: real("difficulty").notNull(),
  elapsedDays: integer("elapsed_days").notNull(),
  lastElapsedDays: integer("last_elapsed_days").notNull(),
  scheduledDays: integer("scheduled_days").notNull(),
  reviewedAt: timestamp("reviewed_at").defaultNow().notNull(),
});