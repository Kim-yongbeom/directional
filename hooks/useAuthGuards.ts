"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/apiClient";

// 보호 페이지용: 토큰 없으면 redirect, 있으면 렌더 허용
export const useRequireAuth = (redirectTo: string = "/login") => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace(redirectTo);
      return;
    }

    setIsChecking(false);
  }, [router, redirectTo]);

  return { isChecking };
};

// 게스트 전용 페이지용: 토큰 있으면 redirect, 없으면 렌더 허용
export const useGuestOnly = (redirectTo: string = "/posts") => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      router.replace(redirectTo);
      return;
    }

    setIsChecking(false);
  }, [router, redirectTo]);

  return { isChecking };
};
