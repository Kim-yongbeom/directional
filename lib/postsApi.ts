import { apiRequest } from "./apiClient";

export type PostCategory = "NOTICE" | "QNA" | "FREE";

export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: PostCategory;
  tags: string[];
  createdAt: string;
}

export interface PostsQueryParams {
  limit?: number;
  search?: string; // 제목/본문 검색
  category?: PostCategory;
  sort?: "title" | "createdAt";
  order?: "asc" | "desc";
  nextCursor?: string;
  prevCursor?: string;
  from?: string;
  to?: string;
}

export interface PostsListResponse {
  items: Post[];
  hasNextPage: boolean;
  nextCursor?: string | null;
}

const buildQuery = (params: PostsQueryParams = {}): string => {
  const usp = new URLSearchParams();
  if (params.limit != null) usp.set("limit", String(params.limit));
  if (params.search) usp.set("search", params.search);
  if (params.category) usp.set("category", params.category);
  if (params.sort) usp.set("sort", params.sort);
  if (params.order) usp.set("order", params.order);
  if (params.nextCursor) usp.set("nextCursor", params.nextCursor);
  if (params.prevCursor) usp.set("prevCursor", params.prevCursor);
  if (params.from) usp.set("from", params.from);
  if (params.to) usp.set("to", params.to);
  const query = usp.toString();
  return query ? `?${query}` : "";
};

export const fetchPosts = async (
  params: PostsQueryParams
): Promise<PostsListResponse> => {
  // 실제 API의 페이지네이션 스펙이 다를 수 있으므로, 응답을 추론형으로 처리
  const query = buildQuery(params);
  const data = await apiRequest<PostsListResponse>(`/posts${query}`, {
    method: "GET",
  });

  // 배열 응답인 경우: items로 감싸고 추가 페이지는 없다고 가정
  if (Array.isArray(data)) {
    const items = data as Post[];
    return {
      items,
      hasNextPage: false,
      nextCursor: null,
    };
  }

  return {
    items: (data.items ?? []) as Post[],
    hasNextPage: Boolean(data.nextCursor),
    nextCursor: data.nextCursor ?? null,
  };
};

export interface CreatePostInput {
  title: string;
  body: string;
  category: PostCategory;
  tags: string[];
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

export const createPost = async (
  input: CreatePostInput
): Promise<Post> => {
  return apiRequest<Post>("/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
};

export const updatePost = async (
  input: UpdatePostInput
): Promise<Post> => {
  const { id, ...rest } = input;
  return apiRequest<Post>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(rest),
  });
};

export const deletePost = async (id: string): Promise<void> => {
  await apiRequest<void>(`/posts/${id}`, {
    method: "DELETE",
  });
};

export const fetchPostById = async (id: string): Promise<Post> => {
  return apiRequest<Post>(`/posts/${id}`, {
    method: "GET",
  });
};
