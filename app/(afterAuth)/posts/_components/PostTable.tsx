"use client";

import type { Post } from "@/lib/postsApi";
import type { ColumnConfig } from "./postTypes";
import React, { useEffect } from "react";

interface PostTableProps {
  posts: Post[];
  columns: ColumnConfig[];
  status: "pending" | "error" | "success";
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onRowClick: (post: Post) => void;
  onResizeColumn: (key: ColumnConfig["key"], width: number) => void;
}

export const PostTable = ({
  posts,
  columns,
  status,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onEdit,
  onDelete,
  onRowClick,
  onResizeColumn,
}: PostTableProps) => {
  const clampWidth = (width: number) => {
    return Math.min(600, Math.max(100, width));
  };

  const attachResizeHandlers = (
    e: React.MouseEvent<HTMLDivElement>,
    key: ColumnConfig["key"]
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const col = columns.find((c) => c.key === key);
    if (!col) return;
    const startWidth = clampWidth(col.width);

    const onMouseMove = (ev: MouseEvent) => {
      const deltaX = ev.clientX - startX;
      const nextWidth = clampWidth(startWidth + deltaX);
      onResizeColumn(key, nextWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const visibleColumnCount = columns.filter((c) => c.visible).length;

  // window 스크롤 기준으로, 바닥 근처에서 다음 페이지 로드
  useEffect(() => {
    if (!hasNextPage || !onLoadMore) return;

    const handleScroll = () => {
      if (!hasNextPage || !onLoadMore || isFetchingNextPage) return;

      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const viewportHeight = window.innerHeight || doc.clientHeight;
      const fullHeight = doc.scrollHeight;

      const distanceToBottom = fullHeight - (scrollTop + viewportHeight);

      // 바닥 200px 이내로 내려왔을 때 다음 페이지 로드
      if (scrollTop > 0 && distanceToBottom < 200) {
        onLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <>
      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full table-fixed border-collapse text-sm">
          <colgroup>
            {columns.map((col) =>
              col.visible ? (
                <col key={col.key} style={{ width: clampWidth(col.width) }} />
              ) : null
            )}
          </colgroup>
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) =>
                col.visible ? (
                  <th
                    key={col.key}
                    className="relative border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-600 select-none"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{col.label}</span>
                      {col.key !== "actions" && (
                      <div
                        className="relative h-6 w-[8px] bg-transparent cursor-col-resize "
                        onMouseDown={(e) => attachResizeHandlers(e, col.key)}
                        >
                          <div className="absolute top-0 left-1 h-6 w-px rounded bg-gray-300" />
                        </div>
                      )}
                    </div>
                  </th>
                ) : null
              )}
            </tr>
          </thead>
          <tbody>
            {status === "pending" && (
              <tr>
                <td
                  colSpan={visibleColumnCount}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  불러오는 중...
                </td>
              </tr>
            )}

            {status === "success" && posts.length === 0 && (
              <tr>
                <td
                  colSpan={visibleColumnCount}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  게시글이 없습니다.
                </td>
              </tr>
            )}

            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-t border-gray-100 odd:bg-white even:bg-gray-50 hover:bg-main/5 cursor-pointer"
                onClick={() => onRowClick(post)}
              >
                {columns.map((col) => {
                  if (!col.visible) return null;

                  if (col.key === "tags") {
                    return (
                      <td key={col.key} className="px-3 py-2 align-top">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-md border border-main/20 bg-main/10 px-2 py-[2px] text-xs text-main"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    );
                  }

                  if (col.key === "category") {
                    return (
                      <td key={col.key} className="px-3 py-2 align-top">
                        {post.category === "FREE" ? "자유" : post.category === "NOTICE" ? "공지" : "Q&A"}
                      </td>
                    );
                  }

                  if (col.key === "actions") {
                    return (
                      <td key={col.key} className="flex justify-center items-center px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(post);
                            }}
                            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(post.id);
                            }}
                            className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 cursor-pointer whitespace-nowrap"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    );
                  }

                  let value: React.ReactNode = null;
                  if (col.key === "createdAt") {
                    value = new Date(post.createdAt).toLocaleString();
                  } else {
                    const postRecord: Record<string, React.ReactNode> = {
                      id: post.id,
                      title: post.title,
                      body: post.body,
                      category: post.category,
                      tags: post.tags,
                    };
                    value = postRecord[col.key as string];
                  }

                  const content =
                    col.key === "title" || col.key === "body" ? (
                      <div
                        className="max-h-[300px] overflow-y-auto break-all"
                      >
                        {value}
                      </div>
                    ) : (
                      value
                    );

                  return (
                    <td key={col.key} className="px-3 py-2 align-top">
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};


