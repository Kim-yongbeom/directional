"use client";

import { useEffect, useRef, useState } from "react";
import type { PostCategory } from "@/lib/postsApi";
import type { ColumnConfig } from "./postTypes";

interface PostFiltersProps {
  search: string;
  onChangeSearch: (value: string) => void;
  category: PostCategory | "ALL";
  onChangeCategory: (value: PostCategory | "ALL") => void;
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  sort: "title" | "createdAt";
  onChangeSort: (value: "title" | "createdAt") => void;
  order: "asc" | "desc";
  onChangeOrder: (value: "asc" | "desc") => void;
  columns: ColumnConfig[];
  onToggleColumn: (key: ColumnConfig["key"]) => void;
  onOpenCreateForm: () => void;
}

export const PostFilters = ({
  search,
  onChangeSearch,
  category,
  onChangeCategory,
  from,
  to,
  onChangeFrom,
  onChangeTo,
  sort,
  onChangeSort,
  order,
  onChangeOrder,
  columns,
  onToggleColumn,
  onOpenCreateForm,
}: PostFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const openNativePicker = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget as HTMLInputElement & {
      showPicker?: () => void;
    };
    if (input.showPicker) {
      try {
        input.showPicker();
      } catch {
        // 일부 브라우저에서는 제약이 있을 수 있으므로 에러는 무시
      }
    }
  };

  // 입력값 변경을 디바운스하여 상위로 전달
  useEffect(() => {
    const id = setTimeout(() => {
      onChangeSearch(localSearch);
    }, 300);
    return () => clearTimeout(id);
  }, [localSearch, onChangeSearch]);

  // 스크롤 방향에 따라 필터 바 숨김/표시
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;
      console.log(currentY, lastY);
      // 상단 근처에서는 항상 표시
      if (currentY < 150) {
        setIsVisible(true);
      } else if (currentY < lastY) {
        // 위로 스크롤 중이면 표시
        setIsVisible(true);
      } else if (currentY > lastY) {
        // 아래로 스크롤 중이면 숨김
        setIsVisible(false);
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={`sticky top-14 z-20 mb-4 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-transform duration-200 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-main" />
          <span>검색 / 필터</span>
        </div>
        <button
          type="button"
          onClick={onOpenCreateForm}
          className="rounded-lg bg-main px-4 py-2 text-sm font-medium text-white shadow hover:bg-main/80 cursor-pointer"
        >
          새 게시글
        </button>
      </div>

      <div className="flex gap-14 flex-wrap">
        <div className="min-w-[220px]">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            검색어
          </label>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="제목 또는 본문으로 검색"
            className="h-9 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-main focus:ring-1 focus:ring-main/40"
          />
        </div>

        <div className="min-w-[220px]">
          <label className="mb-2 block text-sm font-medium text-gray-600">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {["ALL", "FREE", "NOTICE", "QNA"].map((value) => {
              const isActive = category === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    onChangeCategory(value as PostCategory | "ALL")
                  }
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    isActive
                      ? "border-main bg-main text-white shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {value === "ALL" ? "전체" : value === "FREE" ? "자유" : value === "NOTICE" ? "공지" : "Q&A"}
                </button>
              );
            })}
          </div>
        </div> 

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-600">정렬</span>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-1 py-0.5">
              {[
                { label: "생성일", value: "createdAt" as "createdAt" },
                { label: "제목", value: "title" as "title" },
              ].map((opt) => {
                const active = sort === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChangeSort(opt.value)}
                    className={`px-2 py-1 rounded-full text-sm ${
                      active
                        ? "bg-white text-main shadow-sm"
                        : "text-gray-600 hover:bg-gray-200 cursor-pointer"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-1 py-0.5">
              {[
                { label: "내림차순", value: "desc" as "desc" },
                { label: "오름차순", value: "asc" as "asc" },
              ].map((opt) => {
                const active = order === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChangeOrder(opt.value)}
                    className={`px-2 py-1 rounded-full text-sm ${
                      active
                        ? "bg-white text-main shadow-sm"
                        : "text-gray-600 hover:bg-gray-200 cursor-pointer"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-gray-600">
            표시 설정
          </span>
          <div className="flex flex-wrap gap-2">
            {columns.map((col) =>
              col.key === "actions" ? null : (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => onToggleColumn(col.key)}
                  className={`rounded-full border px-2.5 py-0.5 text-sm transition cursor-pointer ${
                    col.visible
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200"
                  }`}
                >
                  {col.label || "액션"}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex-1 max-w-[400px]">
          <label className="mb-2 block text-sm font-medium text-gray-600">
            작성일 범위
          </label>
          <div className="flex items-center gap-2">
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => onChangeFrom(e.target.value)}
              onClick={openNativePicker}
              className="h-9 w-full rounded-md border border-gray-300 px-2 text-xs outline-none"
            />
            <span className="text-xs text-gray-400">~</span>
            <input
              type="datetime-local"
              value={to}
              onChange={(e) => onChangeTo(e.target.value)}
              onClick={openNativePicker}
              className="h-9 w-full rounded-md border border-gray-300 px-2 text-xs outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
