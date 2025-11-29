"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPost,
  deletePost,
  fetchPosts,
  updatePost,
  type Post,
  type PostCategory,
} from "@/lib/postsApi";
import { PostFilters } from "./PostFilters";
import { PostTable } from "./PostTable";
import { PostFormModal } from "./PostFormModal";
import { INITIAL_COLUMNS, type ColumnConfig, type PostFormValues } from "./postTypes";

const FORBIDDEN_WORDS = ["캄보디아", "프놈펜", "불법체류", "텔레그램"];

const Posts = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PostCategory | "ALL">("ALL");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [sort, setSort] = useState<"title" | "createdAt">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [columns, setColumns] = useState<ColumnConfig[]>(
    INITIAL_COLUMNS.map((c) => ({
      ...c,
      width: c.width || 100,
    }))
  );

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<PostFormValues>({
    title: "",
    body: "",
    category: "FREE",
    tags: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", { search, category, from, to, sort, order }],
    queryFn: ({ pageParam }: { pageParam?: string | null }) => {
      const toIso = (value: string | undefined) => {
        if (!value) return undefined;
        // string($date-time) 형식으로 ISO 날짜 문자열 생성 (datetime-local 값 사용)
        const d = new Date(value);
        return d.toISOString();
      };

      const fromParam = toIso(from);
      const toParam = toIso(to);

      return fetchPosts({
        limit: 40,
        search,
        category: category === "ALL" ? undefined : category,
        sort,
        order,
        from: fromParam,
        to: toParam,
        nextCursor: pageParam ?? undefined,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor ?? null : null,
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const openCreateForm = () => {
    setEditingPost(null);
    setFormValues({
      title: "",
      body: "",
      category: "FREE",
      tags: "",
    });
    setFormError(null);
    setFormOpen(true);
  };

  const openEditForm = (post: Post) => {
    setDetailOpen(false);
    setSelectedPost(null);
    setEditingPost(post);
    setFormValues({
      title: post.title,
      body: post.body,
      category: post.category,
      tags: post.tags.join(", "),
    });
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingPost(null);
  };

  const openDetail = (post: Post) => {
    setSelectedPost(post);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedPost(null);
  };

  // 모달 열릴 때 배경 스크롤 잠금
  useEffect(() => {
    if (formOpen || detailOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = original;
      };
    }

    document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [formOpen, detailOpen]);

  const validateForm = (): boolean => {
    const { title, body, tags } = formValues;

    if (!title.trim()) {
      setFormError("제목을 입력해 주세요.");
      return false;
    }
    if (title.trim().length > 80) {
      setFormError("제목은 최대 80자까지 입력 가능합니다.");
      return false;
    }

    if (!body.trim()) {
      setFormError("본문을 입력해 주세요.");
      return false;
    }
    if (body.trim().length > 2000) {
      setFormError("본문은 최대 2000자까지 입력 가능합니다.");
      return false;
    }

    const lower = body.toLowerCase();
    for (const word of FORBIDDEN_WORDS) {
      if (lower.includes(word.toLowerCase())) {
        setFormError(`본문에 금칙어가 포함되어 있습니다.`);
        return false;
      }
    }

    const tagsArr = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const uniqueTags = Array.from(new Set(tagsArr));

    if (uniqueTags.length > 5) {
      setFormError("태그는 최대 5개까지 입력 가능합니다.");
      return false;
    }

    if (uniqueTags.some((t) => t.length > 24)) {
      setFormError("각 태그는 최대 24자까지 입력 가능합니다.");
      return false;
    }

    return true;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (createMutation.isPending || updateMutation.isPending) return;

    if (!validateForm()) return;

    const tagsArr = Array.from(
      new Set(
        formValues.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );

    const input = {
      title: formValues.title.trim(),
      body: formValues.body.trim(),
      category: formValues.category,
      tags: tagsArr,
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, ...input });
    } else {
      createMutation.mutate(input);
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    deleteMutation.mutate(id);
  };

  const toggleColumnVisibility = (key: ColumnConfig["key"]) => {
    setColumns((cols) =>
      cols.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
    );
  };

  const handleColumnResize = (key: ColumnConfig["key"], width: number) => {
    const clamped = Math.min(600, Math.max(100, width));
    setColumns((cols) =>
      cols.map((c) => (c.key === key ? { ...c, width: clamped } : c))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      <div className="relative mx-auto max-w-[2000px]">
        <header className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-800">게시판</h1>
        </header>

        <PostFilters
          search={search}
          onChangeSearch={setSearch}
          category={category}
          onChangeCategory={setCategory}
          from={from}
          to={to}
          onChangeFrom={setFrom}
          onChangeTo={setTo}
          sort={sort}
          onChangeSort={setSort}
          order={order}
          onChangeOrder={setOrder}
          columns={columns}
          onToggleColumn={toggleColumnVisibility}
          onOpenCreateForm={openCreateForm}
        />

        <PostTable
          posts={posts}
          columns={columns}
          status={status}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
          onRowClick={openDetail}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onResizeColumn={handleColumnResize}
        />
      </div>

      <PostFormModal
        open={formOpen}
        editingPost={editingPost}
        formValues={formValues}
        formError={formError}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onChangeFormValues={(values) =>
          setFormValues((prev) => ({ ...prev, ...values }))
        }
        onClose={closeForm}
        onSubmit={handleSubmitForm}
      />

      {/* 상세 모달 */}
      {detailOpen && selectedPost && (
        <div onClick={closeDetail} className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">
                게시글 상세
              </h2>
              <button
                type="button"
                onClick={closeDetail}
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <header className="border-b border-gray-100 pb-3">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-[2px] text-sm font-medium text-gray-600">
                  {selectedPost.category === "FREE" ? "자유" : selectedPost.category === "NOTICE" ? "공지" : "Q&A"}
                </span>
                <span>
                  {new Date(selectedPost.createdAt).toLocaleString()}
                </span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900 break-all">
                {selectedPost.title}
              </h1>
            </header>

            {selectedPost.tags?.length > 0 && (
              <section className="mt-3 flex flex-wrap gap-1.5">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md border border-main/20 bg-main/10 px-2 py-[2px] text-xs text-main"
                  >
                    {tag}
                  </span>
                ))}
              </section>
            )}

            <section className="mt-4 max-h-[400px] overflow-y-auto rounded-lg bg-gray-50 px-4 py-3 text-base leading-relaxed text-gray-800 whitespace-pre-wrap break-all">
              {selectedPost.body}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
