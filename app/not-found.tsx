import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-gray-700">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-400">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          주소가 잘못되었습니다.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <Link
            href="/"
            className="inline-flex w-full justify-center rounded-lg bg-main px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-main/80 sm:w-auto"
          >
            메인페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
