import {          //*cài đặt Drizzle ORM cho PostgreSQL (ORM là Object Relational Mapping, giúp thao tác DB dễ dàng hơn)
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

// *1. BẢNG USERS (Đồng bộ từ Supabase Auth)
export const users = pgTable("users", {
  id: text("id").primaryKey(), // dòng này là khóa chính, dùng để xác định duy nhất mỗi người dùng
  email: text("email").unique().notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// *2. BẢNG WORDS (Kho từ vựng HSK & Từ điển)
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
  (table) => [    // đây là các chỉ mục (index) giúp tìm kiếm nhanh hơn trong cơ sở dữ liệu
    index("words_hanzi_idx").on(table.hanzi),
    index("words_pinyin_clean_idx").on(table.pinyinClean),
    index("words_hanviet_idx").on(table.hanviet),
    index("words_hsk_level_idx").on(table.hskLevel),
  ]
);

// 3. BẢNG DECKS (Bộ thẻ học tập)
export const decks = pgTable("decks", {
  id: uuid("id").defaultRandom().primaryKey(),  //tại sao lại là uuid? Vì mỗi bộ thẻ có thể được tạo ra bởi người dùng khác nhau, nên cần một định danh duy nhất toàn cầu để tránh trùng lặp. UUID (Universally Unique Identifier) là một chuỗi ký tự dài, đảm bảo rằng mỗi bộ thẻ sẽ có một ID duy nhất, ngay cả khi được tạo ra trên các hệ thống khác nhau.
  userId: text("user_id"), // null đối với bộ HSK 1 hệ thống, có ID với bộ thẻ cá nhân
  name: text("name").notNull(), // Tên bộ thẻ (ví dụ: "HSK 2.0 Cấp độ 1")
  description: text("description"), // Mô tả ngắn
  isSystem: boolean("is_system").default(false).notNull(), // true: Bộ chỉ đọc của hệ thống
  createdAt: timestamp("created_at").defaultNow().notNull(), // Thời điểm tạo bộ thẻ
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Thời điểm cập nhật bộ thẻ gần nhất
});

// 4. BẢNG DECK_CARDS (Liên kết từ vựng vào bộ thẻ)
//tại sao cần deck_cards? Vì một từ vựng có thể xuất hiện trong nhiều bộ thẻ khác nhau, và một bộ thẻ có thể chứa nhiều từ vựng. Do đó, chúng ta cần một bảng trung gian để quản lý mối quan hệ nhiều-nhiều này giữa từ vựng và bộ thẻ.
export const deckCards = pgTable(
  "deck_cards",
  {
    id: serial("id").primaryKey(),
    deckId: uuid("deck_id")
      .references(() => decks.id, { onDelete: "cascade" })  // Khi một bộ thẻ bị xóa, tất cả các liên kết từ vựng trong bộ thẻ đó cũng sẽ bị xóa (cascade delete)
      .notNull(),
    wordId: integer("word_id")
      .references(() => words.id, { onDelete: "cascade" }) // Khi một từ vựng bị xóa, tất cả các liên kết của từ vựng đó trong các bộ thẻ cũng sẽ bị xóa (cascade delete)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("deck_cards_deck_word_idx").on(table.deckId, table.wordId),
  ]
);

// 5. BẢNG CARD_STATES (Trạng thái trí nhớ FSRS của từng người dùng với từng từ)
//tại sao cần card_states? Vì mỗi người dùng sẽ có trạng thái học tập khác nhau cho cùng một từ vựng. Bảng này giúp lưu trữ thông tin về tiến trình học tập của từng người dùng với từng từ, bao gồm trạng thái hiện tại, thời điểm ôn tập tiếp theo, độ bền trí nhớ, độ khó của từ, số lần ôn tập, số lần quên, và các thông tin liên quan khác.
export const cardStates = pgTable(
  "card_states",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    wordId: integer("word_id")
      .references(() => words.id, { onDelete: "cascade" })
      .notNull(),
    // FSRS State: 0 = New, 1 = Learning, 2 = Review, 3 = Relearning
    state: integer("state").default(0).notNull(),  // Trạng thái hiện tại của từ vựng theo FSRS
    due: timestamp("due").defaultNow().notNull(), // Thời điểm đến hạn ôn tiếp theo
    stability: real("stability").default(0).notNull(), // Độ bền trí nhớ (FSRS S)
    difficulty: real("difficulty").default(0).notNull(), // Độ khó của từ (FSRS D)
    elapsedDays: integer("elapsed_days").default(0).notNull(),  // Số ngày đã trôi qua kể từ lần ôn tập trước
    scheduledDays: integer("scheduled_days").default(0).notNull(),  // Số ngày được lên lịch ôn tập tiếp theo
    lastElapsedDays: integer("last_elapsed_days").default(0).notNull(), // Số ngày đã trôi qua kể từ lần ôn tập trước đó (trước lần ôn tập hiện tại)  
    reps: integer("reps").default(0).notNull(), // Số lần đã ôn
    lapses: integer("lapses").default(0).notNull(), // Số lần quên
    lastReview: timestamp("last_review"), // Lần ôn gần nhất
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("card_states_user_word_idx").on(table.userId, table.wordId),  // Mỗi người dùng chỉ có một trạng thái duy nhất cho mỗi từ vựng
    index("card_states_due_idx").on(table.userId, table.due), // Tạo chỉ mục trên cột due để tìm kiếm nhanh các từ đến hạn ôn tập cho từng người dùng
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