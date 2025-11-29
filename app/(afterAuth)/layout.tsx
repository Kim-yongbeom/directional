"use client";

import type { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/useAuthGuards";
import { Header } from "@/app/_components/Header";

const AfterAuthLayout = ({ children }: { children: ReactNode }) => {
  const { isChecking } = useRequireAuth("/login");

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500 text-sm">
        이동 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-4">{children}</main>
    </div>
  );
};

export default AfterAuthLayout;
