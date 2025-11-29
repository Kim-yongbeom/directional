 "use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginRequest, type LoginVariables } from "@/lib/authApi";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: (variables: LoginVariables) => loginRequest(variables),
    onSuccess: () => {
      router.replace("/posts");
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
      <div className="w-full max-w-md px-8 py-10 rounded-2xl bg-white border border-gray-200">
        <div className="mb-8 text-center">
          <p className="text-xl uppercase tracking-[0.4em] mb-3">
            디렉셔널
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {errorMessage && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {errorMessage}
            </p>
          )}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-500"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-main focus:ring-2 focus:ring-main/40"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-500"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                required
                className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 pr-10 text-sm outline-none focus:border-main focus:ring-2 focus:ring-main/40"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs cursor-pointer text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "숨기기" : "보기"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-main px-4 py-2.5 text-sm font-medium text-white shadow-sm transition cursor-pointer hover:bg-main/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
