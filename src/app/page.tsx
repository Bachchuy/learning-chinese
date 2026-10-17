import React, { Suspense } from "react";
import Link from "next/link";
import { db } from "@/server/db";
import { words, decks } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import {
  Layers,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

async function HomeDashboard() {
  // Lấy dữ liệu từ cơ sở dữ liệu
  const allWords = await db.select().from(words).limit(6);  // Lấy 6 từ vựng mẫu từ cơ sở dữ liệu để hiển thị trên trang chủ
  const totalWordsCount = (await db.select().from(words)).length;  // Lấy tổng số từ vựng trong cơ sở dữ liệu để hiển thị trên trang chủ
  const systemDeck = await db  // Lấy bộ thẻ hệ thống từ cơ sở dữ liệu
    .select()
    .from(decks)
    .where(eq(decks.isSystem, true))
    .limit(1);

  return (
    <div className="space-y-8">
      {/* 1. HERO / BANNER NHIỆM VỤ HÔM NAY */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-[13px] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Lộ trình HSK 2.0 Cấp độ 1</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight">
              Chào mừng bạn đến với HSK 1 Tutor!
            </h1>
            <p className="text-[15px] text-[#475569] max-w-xl">
              Hệ thống học từ vựng tiếng Trung qua cầu nối <strong>Âm Hán-Việt</strong> và thuật toán lặp lại ngắt quãng thông minh <strong>FSRS</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/review"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold text-[15px] shadow-sm transition-colors min-h-[44px]"
            >
              <Layers className="w-5 h-5" />
              <span>Bắt đầu ôn tập</span>
            </Link>
            <Link
              href="/dictionary"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-medium text-[15px] border border-[#CBD5E1] transition-colors min-h-[44px]"
            >
              <Search className="w-5 h-5 text-[#64748B]" />
              <span>Tra từ điển</span>
            </Link>
          </div>
        </div>

        {/* Thanh tiến độ tổng quan */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
            <div className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">
              Tổng từ vựng HSK 1
            </div>
            <div className="text-2xl font-bold text-[#0F172A] mt-1">
              {totalWordsCount} từ
            </div>
            <div className="text-[12px] text-[#15803D] mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã sẵn sàng trong Database
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
            <div className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">
              Đã học (Learned)
            </div>
            <div className="text-2xl font-bold text-[#1D4ED8] mt-1">0 từ</div>
            <div className="text-[12px] text-[#64748B] mt-1">
              Đã qua ít nhất 1 lượt ôn tập
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
            <div className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">
              Đã thuộc (Mastered)
            </div>
            <div className="text-2xl font-bold text-[#15803D] mt-1">0 từ</div>
            <div className="text-[12px] text-[#64748B] mt-1">
              Độ bền FSRS S &ge; 21 ngày
            </div>
          </div>
        </div>
      </section>

      {/* 2. KHU VỰC BỘ THẺ HỆ THỐNG */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A]">
            Bộ thẻ chuẩn lộ trình
          </h2>
          <Link
            href="/decks"
            className="text-[14px] text-[#1D4ED8] hover:underline font-semibold flex items-center gap-1"
          >
            Xem tất cả bộ thẻ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {systemDeck.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-[#BFDBFE] p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#1D4ED8]" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 pl-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] text-[11px] font-bold px-2.5 py-0.5 rounded">
                    HSK 1
                  </span>
                  <span className="bg-[#F1F5F9] text-[#475569] text-[11px] font-medium px-2 py-0.5 rounded">
                    Mặc định • Chỉ đọc
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  {systemDeck[0].name}
                </h3>
                <p className="text-[14px] text-[#64748B]">
                  {systemDeck[0].description}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:self-center pl-2 sm:pl-0">
                <Link
                  href={`/decks/${systemDeck[0].id}`}
                  className="px-4 py-2.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[14px] font-medium text-[#0F172A] transition-colors"
                >
                  Xem 150 từ
                </Link>
                <Link
                  href={`/review?deckId=${systemDeck[0].id}`}
                  className="px-4 py-2.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-[14px] font-semibold text-white shadow-sm transition-colors"
                >
                  Bắt đầu học
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. MẪU TỪ VỰNG HSK 1 ĐƯỢC LOAD TỪ DATABASE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A]">
            Khám phá từ vựng mẫu (4 tầng ngôn ngữ)
          </h2>
          <Link
            href="/dictionary"
            className="text-[14px] text-[#1D4ED8] hover:underline font-semibold flex items-center gap-1"
          >
            Mở Từ điển tra cứu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allWords.map((word) => (
            <div
              key={word.id}
              className="bg-white rounded-xl border border-[#E2E8F0] p-4 hover:border-[#CBD5E1] transition-shadow shadow-sm flex items-start justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold text-[#0F172A] hanzi">
                    {word.hanzi}
                  </span>
                  <span className="text-[15px] font-medium text-[#0369A1]">
                    {word.pinyin}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block text-[11px] font-bold text-[#0369A1] bg-[#F0F9FF] border border-[#BAE6FD] px-1.5 py-0.5 rounded">
                    [{word.hanviet}]
                  </span>
                  {word.partsOfSpeech && (
                    <span className="text-[12px] text-[#64748B] italic">
                      ({word.partsOfSpeech})
                    </span>
                  )}
                  <span className="text-[14px] text-[#0F172A] font-medium truncate">
                    {word.meaningVi}
                  </span>
                </div>
                {word.exampleHanzi && (
                  <p className="text-[12px] text-[#64748B] pt-1 border-t border-[#F1F5F9] mt-1 truncate">
                    Ví dụ: {word.exampleHanzi} ({word.exampleVi})
                  </p>
                )}
              </div>

              <span className="shrink-0 text-[11px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                HSK 1
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

//DashboardSkeleton là một component React hiển thị giao diện tạm thời (skeleton) trong khi dữ liệu từ cơ sở dữ liệu đang được tải. Nó sử dụng hiệu ứng "animate-pulse" để tạo cảm giác đang tải dữ liệu, giúp người dùng biết rằng nội dung sẽ xuất hiện sớm.
function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 h-64" />
      <div className="bg-white rounded-2xl border border-[#BFDBFE] p-6 h-32" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-4 h-28" />
        ))}
      </div>
    </div>
  );
}

// HomePage là component chính của trang chủ, sử dụng Suspense để hiển thị DashboardSkeleton trong khi HomeDashboard đang tải dữ liệu từ cơ sở dữ liệu. Khi dữ liệu đã sẵn sàng, HomeDashboard sẽ được hiển thị.
export default function HomePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HomeDashboard />
    </Suspense>
  );
}