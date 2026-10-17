# 🇨🇳 HSK 1 Tutor — Ứng Dụng Học Tiếng Trung & Ôn Tập FSRS

> **Học từ vựng tiếng Trung dễ dàng hơn cho người Việt** thông qua cầu nối **Âm Hán-Việt** và thuật toán ghi nhớ lặp lại ngắt quãng thông minh **FSRS (Free Spaced Repetition Scheduler)**.

---

## 🌟 Giới Thiệu Dự Án

Người Việt Nam có một lợi thế vô cùng lớn khi học tiếng Trung: **hơn 60% từ vựng tiếng Việt là từ gốc Hán-Việt**. 
Ví dụ: 
- `学生 (xué sheng)` ➔ **HỌC SINH**
- `时间 (shí jiān)` ➔ **THỜI GIAN**
- `国家 (guó jiā)` ➔ **QUỐC GIA**

Tuy nhiên, hầu hết các ứng dụng học tiếng Trung hiện nay đều dịch thẳng sang tiếng Anh hoặc dịch thô sang tiếng Việt mà bỏ quên mất chiếc **cầu nối vàng** này.

**HSK 1 Tutor** ra đời để giúp người mới bắt đầu làm chủ toàn bộ **150 từ vựng cốt lõi HSK 2.0 Cấp 1** một cách tự nhiên nhất:
1. **Hiểu bản chất qua Âm Hán-Việt** để thuộc từ ngay từ lần chạm đầu tiên.
2. **Khắc sâu vào trí nhớ dài hạn** nhờ thuật toán khoa học hiện đại **FSRS**.
3. **Tra cứu tốc độ cao** không lo bị xung đột với bộ gõ tiếng Việt (Telex).

---

## 🚀 Các Tính Năng Nổi Bật

### 1. 🔍 Tra Cứu Từ Điển Đa Chế Độ (Universal Dictionary)
- **Tốc độ vượt trội:** Phản hồi dưới 200ms với kỹ thuật Debounce thông minh.
- **Chấp mọi kiểu gõ:**
  - Chữ Hán giản thể: `你好`, `学生`
  - Pinyin có dấu / không dấu: `nǐ hǎo`, `nihao`, `ni hao`
  - Pinyin kèm số thanh điệu: `ni3 hao3` *(tuyệt chiêu chống kẹt phím khi dùng bộ gõ Unikey/EVKey)*
  - Nghĩa tiếng Việt & Âm Hán-Việt: `học sinh`, `thời gian`
- **Bộ lọc 2 chiều:** Dễ dàng chuyển đổi giữa `[Tất cả]`, `[🇨🇳 Trung ➔ Việt]` và `[🇻🇳 Việt ➔ Trung]`.
- **Giao diện Master-Detail:** Danh sách kết quả bên trái, chi tiết từ vựng khổ lớn bên phải kèm ví dụ ngữ cảnh thực tế.
- **Phát âm chuẩn bản ngữ:** Tích hợp Web Speech API (`zh-CN`), nghe phát âm trực tiếp chỉ bằng 1 cú click.

### 2. 🧠 Thuật Toán Ghi Nhớ Lặp Lại Ngắt Quãng (FSRS Engine)
- Thay thế thuật toán SM-2 cổ điển của thế kỷ trước bằng **FSRS (Free Spaced Repetition Scheduler)** thế hệ mới.
- Tự động tính toán chu kỳ lặp lại dựa trên độ bền trí nhớ (Stability) và độ khó của từng từ vựng (Difficulty).
- 4 nút đánh giá trực quan: **Lại (Again)**, **Khó (Hard)**, **Tốt (Good)**, **Dễ (Easy)**.

### 3. 🗂️ Quản Lý Bộ Thẻ Cá Nhân & Hệ Thống (Decks)
- Bộ thẻ hệ thống: Trọn bộ 150 từ vựng HSK 1 chuẩn quốc tế đã được chuẩn hóa sẵn.
- Tạo bộ thẻ cá nhân: Người học tự tạo các chủ đề yêu thích (Đi du lịch, Mua sắm, Đồ ăn...).
- Thêm từ nhanh: Tra từ điển và lưu thẳng vào bộ thẻ chỉ với 1 click.

### 4. 🎨 Trải Nghiệm Người Dùng Tinh Tế (Focused Studio UI)
- **Chuẩn hóa chữ Hán:** Cỡ chữ Hán luôn từ 18px trở lên, chữ Flashcard 56px, hạn chế tối đa bết nét khi học.
- **Bảo toàn tiếng Việt:** Thiết lập `line-height >= 1.5` chống tuyệt đối lỗi cụt dấu mũ/móc/nặng (`ể`, `ự`).
- **Phím tắt tiện lợi:** Nhấn phím `/` ở bất kỳ đâu để nhảy nhanh vào ô tìm kiếm.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ | Chi tiết sử dụng |
|---|---|---|
| **Core Framework** | **Next.js 16.4 (App Router)** | React 19, Server Components, Turbopack |
| **Styling** | **Tailwind CSS v4** | Theme *Focused Studio*, tối ưu responsive Mobile & Desktop |
| **Database & ORM** | **Supabase (PostgreSQL) + Drizzle ORM** | Hệ thống 6 bảng quan hệ chặt chẽ, type-safe toàn diện |
| **Algorithm** | **`ts-fsrs`** | Thuật toán Spaced Repetition mã nguồn mở hàng đầu |
| **Icons & Audio** | **Lucide React + Web Speech API** | Hệ thống icon tối giản và giọng đọc tiếng Trung bản xứ |
| **Language** | **TypeScript 5** | Strict mode 100%, 0 warning, 0 error |

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Trang chủ & Thống kê tiến độ
│   ├── layout.tsx                # AppShell khung điều hướng (Sidebar/BottomNav)
│   ├── dictionary/page.tsx       # Tra cứu từ điển & Khám phá từ vựng
│   ├── decks/                    # Quản lý bộ thẻ hệ thống & cá nhân
│   ├── review/                   # Không gian lật thẻ ôn tập FSRS
│   └── api/dictionary/search/    # Route Handler tìm kiếm tối ưu index
│
├── core/                         # Pure Functions (Logic thuần túy)
│   ├── search-normalize.ts       # Chuẩn hóa Pinyin, chữ Hán, tiếng Việt
│   ├── fsrs.ts                   # Cấu hình & wrapper thuật toán FSRS
│   └── review-queue.ts           # Hàng đợi ôn tập thẻ mỗi ngày
│
├── server/                       # Backend & Database
│   ├── db/                       # Drizzle ORM schemas & PostgreSQL client
│   │   ├── schema.ts             # 6 bảng: words, decks, cards, logs...
│   │   ├── hsk1-data.ts          # Dữ liệu từ vựng HSK 1 chuẩn
│   │   └── seed.ts               # Kịch bản nạp dữ liệu tự động
│   └── actions/                  # Server Actions (Mutations an toàn)
│
└── components/                   # UI Components dùng chung
    └── AppShell.tsx              # Khung điều hướng responsive
```

---

## ⚡ Hướng Dẫn Cài Đặt & Chạy Môi Trường Local

### 1. Yêu cầu hệ thống
- **Node.js** phiên bản 20 trở lên.
- Trình quản lý gói: `npm` (khuyến nghị), `pnpm` hoặc `yarn`.
- Một tài khoản cơ sở dữ liệu **Supabase (PostgreSQL)** miễn phí.

### 2. Cài đặt các bước

```bash
# 1. Clone mã nguồn về máy
git clone https://github.com/Bachchuy/learning-chinese.git
cd learning-chinese/learning-chinese

# 2. Cài đặt các dependencies
npm install

# 3. Tạo file cấu hình môi trường (.env.local)
# Cấu hình DATABASE_URL trỏ tới cơ sở dữ liệu PostgreSQL của bạn:
echo "DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" > .env.local

# 4. Đẩy cấu trúc Database lên Supabase
npm run db:push

# 5. Nạp dữ liệu từ vựng HSK 1 ban đầu
npm run db:seed

# 6. Khởi động ứng dụng ở môi trường phát triển
npm run dev
```

Mở trình duyệt tại: **`http://localhost:3000`** để bắt đầu trải nghiệm!

---

## 🌿 Quy Trình Phát Triển (Git Flow & Standards)

Dự án áp dụng chặt chẽ quy chuẩn phát triển phần mềm trong doanh nghiệp:
- **`main`**: Nhánh Production chính thức, chỉ merge code đã kiểm thử hoàn tất.
- **`develop`**: Nhánh Staging tích hợp chung của toàn bộ dự án.
- **`feature/*`**: Các nhánh tính năng phát triển độc lập.
- **Commit Message**: Tuân thủ nghiêm ngặt chuẩn [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat(...)`: Thêm tính năng mới
  - `fix(...)`: Sửa lỗi
  - `docs(...)`: Cập nhật tài liệu
  - `style(...)`: Tinh chỉnh giao diện/CSS
  - `refactor(...)`: Tối ưu cấu trúc mã nguồn

---

## 👤 Tác Giả & Bản Quyền

- **Phát triển bởi:** [Bạch Chuy](https://github.com/Bachchuy)
- **Đồng hành & Định hướng kỹ thuật:** AI Senior Tech Lead & Mentor
- **Giấy phép (License):** [MIT License](LICENSE) — Tự do học tập và phát triển phi thương mại.
