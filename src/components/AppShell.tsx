//file này có chức năng gì? 
// AppShell là một component chứa cấu trúc tổng quát của ứng dụng, bao gồm sidebar, header, main content và bottom navigation bar.
"use client";  // Vì AppShell sử dụng hook usePathname từ Next.js, nên cần đánh dấu là "client component" để có thể chạy trên trình duyệt.

import React from "react";
import Link from "next/link";  // Link từ Next.js để điều hướng giữa các trang mà không reload lại toàn bộ trang
import { usePathname } from "next/navigation";   // Hook usePathname từ Next.js để lấy đường dẫn hiện tại, giúp xác định trang đang hiển thị và highlight menu tương ứng.
import {
  LayoutDashboard,  // Icon cho trang tổng quan
  Layers,  // Icon cho trang ôn tập
  Search,  // Icon cho trang từ điển
  FolderKanban,  // Icon cho trang bộ thẻ
  BookOpen,  // Icon cho trang từ vựng và chưa dùng đến
  User,  // Icon cho thông tin người dùng
} from "lucide-react";  // Thư viện icon lucide-react để hiển thị các biểu tượng trong giao diện

//interface AppShellProps dùng để định nghĩa kiểu dữ liệu cho props của component AppShell. Nó chỉ có một thuộc tính duy nhất là children, kiểu React.ReactNode, cho phép truyền bất kỳ nội dung React nào vào bên trong AppShell.
interface AppShellProps {  // Định nghĩa kiểu props cho component AppShell
  children: React.ReactNode;
}

// Mảng NAV_ITEMS chứa thông tin về các mục điều hướng trong sidebar và bottom navigation bar, bao gồm đường dẫn (href), nhãn (label) và biểu tượng (icon) tương ứng.
const NAV_ITEMS = [
  {
    href: "/",
    label: "Tổng quan",
    icon: LayoutDashboard,
  },
  {
    href: "/review",
    label: "Ôn tập",
    icon: Layers,
  },
  {
    href: "/dictionary",
    label: "Từ điển",
    icon: Search,
  },
  {
    href: "/decks",
    label: "Bộ thẻ",
    icon: FolderKanban,
  },
];

// Component AppShell là khung tổng thể của ứng dụng, bao gồm sidebar, header, main content và bottom navigation bar. Nó nhận props children để hiển thị nội dung chính của từng trang.
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // Quy chuẩn UX cốt lõi: Ẩn hoàn toàn Bottom Bar khi đang trong phiên ôn tập /review
  const isReviewSession = pathname.startsWith("/review");  // Kiểm tra xem có đang trong phiên ôn tập không
  //return: trả về cấu trúc giao diện của AppShell, bao gồm sidebar, header, main content và bottom navigation bar. Sử dụng Tailwind CSS để tạo kiểu dáng và bố cục.
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col lg:flex-row">
      {/* 1. SIDEBAR CHO DESKTOP (>= 1024px) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-[#E2E8F0] z-30">
        {/* Logo / Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0] gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1D4ED8] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            汉
          </div>
          <div>
            <div className="font-bold text-[15px] leading-tight text-[#0F172A]">
              HSK 1 Tutor
            </div>
            <div className="text-[12px] text-[#64748B]">Học Tiếng Trung FSRS</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#1D4ED8] font-semibold"
                    : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-[#1D4ED8]" : "text-[#64748B]"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info / User Account area */}
        <div className="p-3 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#64748B]">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[#0F172A] truncate">
                Khách vãng lai
              </div>
              <div className="text-[11px] text-[#64748B] truncate">
                Tra cứu tự do
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (MAIN WORKSPACE) */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen">
        {/* Mobile Header (hiện khi < 1024px) */}
        <header className="lg:hidden h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#1D4ED8] flex items-center justify-center text-white font-bold text-sm">
              汉
            </div>
            <span className="font-bold text-[15px] text-[#0F172A]">
              HSK 1 Tutor
            </span>
          </div>
          <span className="text-[12px] bg-[#EFF6FF] text-[#1D4ED8] font-semibold px-2 py-0.5 rounded-full border border-[#BFDBFE]">
            HSK 2.0
          </span>
        </header>

        {/* Main Content Viewport */}
        <main
          className={`flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 ${
            !isReviewSession ? "pb-24 lg:pb-8" : "pb-4"
          }`}
        >
          {children}
        </main>
      </div>

      {/* 3. BOTTOM NAVIGATION BAR CHO MOBILE (< 1024px) */}
      {/* TỰ ĐỘNG ẨN KHI Ở /review ĐỂ TẬP TRUNG HỌC TẬP VÀ TRÁNH CHẠM NHẦM */}
      {!isReviewSession && (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-white border-t border-[#E2E8F0] z-30 flex items-center justify-around px-2 shadow-lg">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-16 h-12 rounded-lg transition-colors ${
                  isActive
                    ? "text-[#1D4ED8] font-semibold"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[11px] leading-none">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
