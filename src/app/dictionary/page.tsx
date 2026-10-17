"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Volume2,
  Sparkles,
  BookOpen,
  Loader2,
  ChevronRight,
} from "lucide-react";

// 1. Định nghĩa kiểu dữ liệu từ vựng
interface WordItem {
  id: number;
  hanzi: string;
  traditional?: string | null;
  pinyin: string;
  pinyinClean: string;
  hanviet: string;
  meaningVi: string;
  meaningEn?: string | null;
  partsOfSpeech?: string | null;
  hskLevel: number;
  exampleHanzi?: string | null;
  examplePinyin?: string | null;
  exampleVi?: string | null;
}

type SearchMode = "all" | "zh-vi" | "vi-zh";

// 2. Chip từ vựng gợi ý trên thanh tìm kiếm
const QUICK_CHIPS = ["你好", "学习", "朋友", "喜欢", "时间", "苹果"];

// 3. Danh sách 4 thẻ từ vựng khám phá (Discovery Cards)
const FEATURED_WORDS = [
  {
    hanzi: "学习",
    pinyin: "xuéxí",
    hanviet: "Học tập",
    meaningVi: "Học tập, nghiên cứu",
    partsOfSpeech: "Động từ",
  },
  {
    hanzi: "朋友",
    pinyin: "péngyou",
    hanviet: "Bằng hữu",
    meaningVi: "Bạn bè, người quen",
    partsOfSpeech: "Danh từ",
  },
  {
    hanzi: "喜欢",
    pinyin: "xǐhuan",
    hanviet: "Hỷ hoan",
    meaningVi: "Thích, yêu thích",
    partsOfSpeech: "Động từ",
  },
  {
    hanzi: "时间",
    pinyin: "shíjiān",
    hanviet: "Thời gian",
    meaningVi: "Thời gian, giờ giấc",
    partsOfSpeech: "Danh từ",
  },
];

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("all");
  const [results, setResults] = useState<WordItem[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Phím tắt [/]: Focus nhanh vào ô tìm kiếm
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounce 300ms gọi API (truyền thêm searchMode)
  useEffect(() => {
    const timer = setTimeout(async () => {
      const trimmed = query.trim();
      if (!trimmed) {
        setResults([]);
        setSelectedWord(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/dictionary/search?q=${encodeURIComponent(trimmed)}&mode=${searchMode}`
        );
        const data = await res.json();
        const found = data.results || [];
        setResults(found);

        if (found.length > 0) {
          setSelectedWord(found[0]);
        } else {
          setSelectedWord(null);
        }
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
      } finally {
        setIsLoading(false);
      }
    }, query.trim() ? 300 : 0);

    return () => clearTimeout(timer);
  }, [query, searchMode]);

  // Phát âm chữ Hán bằng Web Speech API
  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* KHỐI 1: HEADER & THANH TÌM KIẾM */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Từ điển Tiếng Trung</h1>
            <p className="text-[14px] text-[#64748B]">Tra cứu và khám phá từ vựng HSK 1</p>
          </div>
        </div>

        {/* Thanh chuyển chế độ tra cứu */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl w-fit border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setSearchMode("all")}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              searchMode === "all"
                ? "bg-white text-[#0F172A] shadow-2xs font-semibold"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setSearchMode("zh-vi")}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              searchMode === "zh-vi"
                ? "bg-white text-[#1D4ED8] shadow-2xs font-semibold"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            🇨🇳 Trung ➔ Việt
          </button>
          <button
            type="button"
            onClick={() => setSearchMode("vi-zh")}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              searchMode === "vi-zh"
                ? "bg-white text-[#0369A1] shadow-2xs font-semibold"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            🇻🇳 Việt ➔ Trung
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === "zh-vi"
                ? "Tìm chữ Hán (你好) hoặc Pinyin (ni3 hao3 / nihao)..."
                : searchMode === "vi-zh"
                ? "Tìm nghĩa tiếng Việt (học sinh) hoặc Âm Hán-Việt (thời gian)..."
                : "Tìm chữ Hán, Pinyin, Hán Việt hoặc nghĩa tiếng Việt..."
            }
            className="w-full h-[52px] pl-12 pr-14 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#1D4ED8] focus:ring-4 focus:ring-[#1D4ED8]/10 outline-none text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] shadow-xs transition-all"
            autoComplete="off"
            spellCheck={false}
          />

          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isLoading && (
              <Loader2 className="w-5 h-5 animate-spin text-[#1D4ED8]" />
            )}
            {query ? (
              <button
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center justify-center h-6 px-2 text-[12px] font-semibold text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] rounded-md shadow-2xs">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Chip từ vựng gợi ý */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[12px] font-semibold text-[#64748B]">Từ hay tra:</span>
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setQuery(chip);
                inputRef.current?.focus();
              }}
              className="px-3 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#BFDBFE] hover:bg-[#EFF6FF] text-[13px] text-[#0F172A] hover:text-[#1D4ED8] font-medium transition-colors shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* KHỐI 2: KHU VỰC HIỂN THỊ CHÍNH */}
      {!query.trim() ? (
        /* TRẠNG THÁI MẶC ĐỊNH: HƯỚNG DẪN 2 CHIỀU & KHÁM PHÁ TỪ VỰNG */
        <div className="space-y-8 pt-2">
          {/* 1. Hướng dẫn 2 chiều: Trung - Việt & Việt - Trung */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setSearchMode("zh-vi");
                inputRef.current?.focus();
              }}
              className={`p-5 rounded-2xl bg-white border text-left transition-all hover:border-[#1D4ED8] hover:shadow-xs space-y-2 group ${
                searchMode === "zh-vi" ? "border-[#1D4ED8] ring-2 ring-[#1D4ED8]/10" : "border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center gap-2 text-[#1D4ED8]">
                <span className="text-lg">🇨🇳</span>
                <h3 className="font-bold text-[14px] text-[#0F172A] group-hover:text-[#1D4ED8]">
                  Tra Trung ➔ Việt
                </h3>
              </div>
              <p className="text-[13px] text-[#64748B] leading-relaxed">
                Nhập chữ Hán (<code className="text-[#0F172A] font-semibold">你好</code>), Pinyin có số (<code className="text-[#0F172A] font-semibold">ni3 hao3</code>) hoặc Pinyin không dấu (<code className="text-[#0F172A] font-semibold">nihao</code>) chống lỗi gõ Telex.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchMode("vi-zh");
                inputRef.current?.focus();
              }}
              className={`p-5 rounded-2xl bg-white border text-left transition-all hover:border-[#0369A1] hover:shadow-xs space-y-2 group ${
                searchMode === "vi-zh" ? "border-[#0369A1] ring-2 ring-[#0369A1]/10" : "border-[#E2E8F0]"
              }`}
            >
              <div className="flex items-center gap-2 text-[#0369A1]">
                <span className="text-lg">🇻🇳</span>
                <h3 className="font-bold text-[14px] text-[#0F172A] group-hover:text-[#0369A1]">
                  Tra Việt ➔ Trung
                </h3>
              </div>
              <p className="text-[13px] text-[#64748B] leading-relaxed">
                Nhập nghĩa tiếng Việt (<code className="text-[#0F172A] font-semibold">học sinh</code>, <code className="text-[#0F172A] font-semibold">xin chào</code>) hoặc Âm Hán-Việt (<code className="text-[#0F172A] font-semibold">thời gian</code>, <code className="text-[#0F172A] font-semibold">bằng hữu</code>).
              </p>
            </button>
          </div>

          {/* 2. Phần "Khám phá từ vựng" (4 thẻ HSK 1) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Khám phá từ vựng HSK 1</h2>
                <p className="text-[13px] text-[#64748B]">Bấm vào một từ để xem phát âm, nghĩa và ví dụ câu</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-[12px] font-bold">
                HSK 1
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURED_WORDS.map((item) => (
                <button
                  key={item.hanzi}
                  onClick={() => {
                    setQuery(item.hanzi);
                    inputRef.current?.focus();
                  }}
                  className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1D4ED8] hover:shadow-xs transition-all text-left group flex items-start justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors">
                        {item.hanzi}
                      </span>
                      <span className="text-[14px] text-[#1D4ED8] font-medium">
                        {item.pinyin}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#0F172A]">
                        {item.meaningVi}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#F0F9FF] text-[#0369A1] font-semibold uppercase">
                        {item.hanviet}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#94A3B8]">{item.partsOfSpeech}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#CBD5E1] group-hover:text-[#1D4ED8] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : !isLoading && results.length === 0 ? (
        /* TRẠNG THÁI KHÔNG TÌM THẤY KẾT QUẢ */
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#CBD5E1] max-w-xl mx-auto space-y-3 mt-6">
          <p className="text-base font-semibold text-[#0F172A]">
            Không tìm thấy từ nào khớp với &quot;{query}&quot;
          </p>
          <p className="text-[13px] text-[#64748B]">
            Gợi ý: Thử kiểm tra lỗi chính tả, gõ Pinyin không dấu hoặc tìm bằng nghĩa tiếng Việt.
          </p>
        </div>
      ) : (
        /* MASTER-DETAIL (KHI CÓ KẾT QUẢ TÌM KIẾM) */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-320px)] min-h-[500px]">
          {/* CỘT TRÁI: DANH SÁCH (MASTER) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col shadow-xs">
            <div className="p-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                Kết quả ({results.length})
              </span>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-[#F1F5F9]">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedWord(item)}
                  className={`w-full text-left p-4 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between group ${
                    selectedWord?.id === item.id
                      ? "bg-[#EFF6FF] border-r-4 border-[#1D4ED8]"
                      : ""
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#0F172A]">
                        {item.hanzi}
                      </span>
                      <span className="text-[13px] text-[#1D4ED8] font-medium">
                        {item.pinyin}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#64748B] line-clamp-1">
                      {item.meaningVi}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-[#CBD5E1] group-hover:text-[#1D4ED8] transition-colors ${
                      selectedWord?.id === item.id
                        ? "text-[#1D4ED8] translate-x-0.5"
                        : ""
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT (DETAIL) */}
          <div className="md:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-y-auto">
            {selectedWord ? (
              <div className="p-8 space-y-8">
                {/* Header Chi tiết */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-end gap-4">
                      <h2 className="text-6xl font-bold text-[#0F172A] tracking-tight">
                        {selectedWord.hanzi}
                      </h2>
                      <button
                        onClick={() => handleSpeak(selectedWord.hanzi)}
                        className="mb-2 p-2.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white transition-all shadow-2xs"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-[#1D4ED8] font-medium">
                        {selectedWord.pinyin}
                      </span>
                      <span className="text-[#94A3B8]">|</span>
                      <span className="text-lg text-[#64748B]">
                        Hán Việt:{" "}
                        <span className="font-semibold text-[#0369A1] uppercase">
                          {selectedWord.hanviet}
                        </span>
                      </span>
                    </div>
                  </div>

                  {selectedWord.hskLevel > 0 && (
                    <div className="px-3.5 py-1.5 bg-[#EFF6FF] text-[#1D4ED8] rounded-xl border border-[#BFDBFE] flex items-center gap-2 shadow-2xs">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-bold">
                        HSK {selectedWord.hskLevel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Phần nghĩa */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <BookOpen className="w-5 h-5" />
                    <h3 className="font-bold uppercase text-[12px] tracking-widest">
                      Định nghĩa &amp; Nghĩa
                    </h3>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9]">
                    <p className="text-xl text-[#0F172A] leading-relaxed font-medium">
                      {selectedWord.meaningVi}
                    </p>
                    {selectedWord.meaningEn && (
                      <p className="mt-2 text-[#64748B] italic text-[14px]">
                        English: {selectedWord.meaningEn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phần ví dụ */}
                {selectedWord.exampleHanzi && (
                  <div className="space-y-3">
                    <h3 className="font-bold uppercase text-[12px] tracking-widest text-[#64748B]">
                      Ví dụ minh họa
                    </h3>
                    <div className="p-5 rounded-2xl border border-[#E2E8F0] space-y-2 hover:border-[#BFDBFE] transition-colors">
                      <p className="text-2xl text-[#0F172A] font-medium">
                        {selectedWord.exampleHanzi}
                      </p>
                      <div className="space-y-0.5">
                        <p className="text-[#1D4ED8] font-medium text-[15px]">
                          {selectedWord.examplePinyin}
                        </p>
                        <p className="text-[#475569] text-[14px]">
                          {selectedWord.exampleVi}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#94A3B8] p-8 text-center">
                <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 opacity-20" />
                </div>
                <p>Chọn một từ bên trái để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}