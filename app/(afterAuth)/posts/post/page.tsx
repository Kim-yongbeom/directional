"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchPostById } from "@/lib/postsApi";

const PostDetailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const enabled = Boolean(id);

  const { data: post, status, error } = useQuery({
    queryKey: ["postDetail", id],
    queryFn: () => fetchPostById(id as string),
    enabled,
  });

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm border border-red-100">
          <p className="text-sm font-medium text-red-600">
            잘못된 접근입니다. 게시글 ID가 없습니다.
          </p>
          <button
            type="button"
            onClick={() => router.push("/posts")}
            className="mt-4 inline-flex items-center rounded-md bg-main px-4 py-2 text-xs font-medium text-white hover:bg-main/80"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500 text-sm">
        로딩 중...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm border border-red-100">
          <p className="text-sm font-medium text-red-600">
            게시글을 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {(error as Error)?.message ?? "잠시 후 다시 시도해 주세요."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/posts")}
            className="mt-4 inline-flex items-center rounded-md bg-main px-4 py-2 text-xs font-medium text-white hover:bg-main/80"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">게시글 정보를 찾을 수 없습니다.</p>
          <button
            type="button"
            onClick={() => router.push("/posts")}
            className="mt-4 inline-flex items-center rounded-md bg-main px-4 py-2 text-xs font-medium text-white hover:bg-main/80"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.push("/posts")}
          className="mb-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
        >
          ← 목록으로
        </button>

        <article className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <header className="border-b border-gray-100 pb-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-[2px] text-[10px] font-medium text-gray-600">
                {post.category}
              </span>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">{post.title}</h1>
          </header>

          {post.tags?.length > 0 && (
            <section className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md border border-main/20 bg-main/10 px-2 py-[2px] text-[10px] text-main"
                >
                  {tag}
                </span>
              ))}
            </section>
          )}

          <section className="mt-5 rounded-lg bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap break-words">
            {post.body}
          </section>
        </article>
      </div>
    </div>
  );
};

export default PostDetailPage;


