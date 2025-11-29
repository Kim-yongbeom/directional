"use client";

import type { Post, PostCategory } from "@/lib/postsApi";
import type { PostFormValues } from "./postTypes";
import React from "react";

interface PostFormModalProps {
  open: boolean;
  editingPost: Post | null;
  formValues: PostFormValues;
  formError: string | null;
  isSubmitting: boolean;
  onChangeFormValues: (values: Partial<PostFormValues>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const BODY_MAX = 2000;
const TITLE_MAX = 80;
const TAG_MAX = 5;
const TAG_LEN_MAX = 24;
const FORBIDDEN_WORDS = ["캄보디아", "프놈펜", "불법체류", "텔레그램"];

export const PostFormModal = ({
  open,
  editingPost,
  formValues,
  formError,
  isSubmitting,
  onChangeFormValues,
  onClose,
  onSubmit,
}: PostFormModalProps) => {
  if (!open) return null;

  const titleLength = formValues.title.length;
  const bodyLength = formValues.body.length;

  const normalizedBody = formValues.body.toLowerCase();
  const forbiddenInBody = FORBIDDEN_WORDS.filter((word) =>
    normalizedBody.includes(word.toLowerCase())
  );

  const rawTags = formValues.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const uniqueTags = Array.from(new Set(rawTags));
  const tagCount = uniqueTags.length;
  const hasTooManyTags = tagCount > TAG_MAX;
  const hasTooLongTag = uniqueTags.some((t) => t.length > TAG_LEN_MAX);
  const hasDuplicateTags = rawTags.length !== uniqueTags.length;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            {editingPost ? "게시글 수정" : "새 게시글 작성"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {formError && (
          <p className="mb-3 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </p>
        )}

        <form className="space-y-3 flex flex-col gap-1" onSubmit={onSubmit}>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-600">
              카테고리
            </label>
            <div className="flex flex-wrap gap-2">
              {(["FREE", "NOTICE", "QNA"] as PostCategory[]).map(
                (value) => {
                  const isActive = formValues.category === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        onChangeFormValues({ category: value })
                      }
                      className={`rounded-full border px-3 py-1 text-sm transition ${
                        isActive
                          ? "border-main bg-main text-white shadow-sm"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      { value === "FREE" ? "자유" : value === "NOTICE" ? "공지" : "Q&A"}
                    </button>
                  );
                }
              )}
            </div>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-600">
              제목
            </label>
            <input
              type="text"
              value={formValues.title}
              onChange={(e) =>
                onChangeFormValues({ title: e.target.value })
              }
              maxLength={TITLE_MAX}
              placeholder="제목을 입력해 주세요 (최대 80자)"
              className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-main focus:ring-1 focus:ring-main/40"
            />
            <p className="text-right mt-1 text-[10px] text-gray-400">
              {titleLength}/{TITLE_MAX}자
            </p>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-600">
              본문
            </label>
            <textarea
              value={formValues.body}
              onChange={(e) =>
                onChangeFormValues({ body: e.target.value })
              }
              rows={10}
              maxLength={BODY_MAX}
              placeholder="본문을 입력해 주세요 (최대 2000자, 금칙어: 캄보디아, 프놈펜, 불법체류, 텔레그램)"
              className="w-full resize-none rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-main focus:ring-1 focus:ring-main/40"
            />
            <div className="mt-1 flex min-h-[14px] items-center justify-between">
              {forbiddenInBody.length > 0 ? (
                <p className="text-[10px] text-red-500">
                  금칙어 포함: {forbiddenInBody.join(", ")}
                </p>
              ) : (
                <span className="text-[10px] text-red-500 opacity-0 pointer-events-none">
                  placeholder
                </span>
              )}
              <p className="text-[10px] text-gray-400">
                {bodyLength}/{BODY_MAX}자
              </p>
            </div>
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-600">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={formValues.tags}
              onChange={(e) =>
                onChangeFormValues({ tags: e.target.value })
              }
              placeholder='예: 프론트엔드, 백엔드 (최대 5개, 각 24자 이내)'
              className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none focus:border-main focus:ring-1 focus:ring-main/40"
            />
            <div className="mt-2 flex min-h-[20px] flex-wrap gap-1">
              {uniqueTags.length === 0 ? (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-[2px] text-xs text-gray-700 opacity-0 pointer-events-none">
                  placeholder
                </span>
              ) : (
                uniqueTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md border border-main/20 bg-main/10 px-2 py-[2px] text-xs text-main"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>
            {(hasTooManyTags || hasTooLongTag) && (
              <p className="mt-1 text-[10px] text-red-500">
                태그는 최대 {TAG_MAX}개, 각 {TAG_LEN_MAX}자 이내여야 합니다.
              </p>
            )}
            {hasDuplicateTags && !hasTooManyTags && !hasTooLongTag && (
              <p className="mt-1 text-[10px] text-orange-500">
                중복된 태그는 자동으로 한 번만 사용됩니다.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-main px-3 py-1.5 text-sm font-medium text-white hover:bg-main/80 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "처리 중"
              ) : editingPost ? (
                "수정"
              ) : (
                "작성"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


