 "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/apiClient";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      router.replace("/posts");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500 text-sm">
      이동 중...
    </div>
  );
};

export default Home;
