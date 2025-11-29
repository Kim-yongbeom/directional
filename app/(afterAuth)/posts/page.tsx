"use client";

import Posts from "./_components/Posts";
import { useRequireAuth } from "@/hooks/useAuthGuards";

const PostsPage = () => {
  const { isChecking } = useRequireAuth("/login");

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500 text-sm">
        이동 중...
      </div>
    );
  }

  return <Posts />;
};

export default PostsPage;