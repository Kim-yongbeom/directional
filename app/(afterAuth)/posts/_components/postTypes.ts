import type { Post, PostCategory } from "@/lib/postsApi";

export interface ColumnConfig {
  key: keyof Post | "actions";
  label: string;
  visible: boolean;
  width: number; // px
}

export type PostFormValues = {
  title: string;
  body: string;
  category: PostCategory;
  tags: string;
};

export const INITIAL_COLUMNS: ColumnConfig[] = [
  { key: "category", label: "카테고리", visible: true, width: 80 },
  { key: "title", label: "제목", visible: true, width: 260 },
  // { key: "body", label: "본문", visible: true, width: 360 },
  { key: "tags", label: "태그", visible: true, width: 200 },
  { key: "createdAt", label: "생성일", visible: true, width: 180 },
  { key: "actions", label: "", visible: true, width: 130 },
];


