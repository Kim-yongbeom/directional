"use client";

import { clearAccessToken } from "@/lib/apiClient";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/posts") return pathname.startsWith("/posts");
    if (href === "/mock") return pathname.startsWith("/mock");
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[2000px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-10">
          <Link href="/posts" className="text-sm font-semibold tracking-[0.2em] text-gray-800">
            디렉셔널
          </Link>
          testetstestset
          <nav className="flex items-center gap-2 text-xs">
            <Link
              href="/posts"
              className={`rounded-full px-3 py-1.5 transition ${
                isActive("/posts")
                  ? "bg-main text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              게시판
            </Link>
            <Link
              href="/mock"
              className={`rounded-full px-3 py-1.5 transition ${
                isActive("/mock")
                  ? "bg-main text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Mock 차트
            </Link>
          </nav>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              clearAccessToken();
              router.replace("/login");
            }}
            className="transition text-sm text-gray-600 cursor-pointer hover:text-gray-800"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};


