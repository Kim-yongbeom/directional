const API_BASE_URL = "https://fe-hiring-rest-api.vercel.app";
const ACCESS_TOKEN_KEY = "accessToken";

interface ApiRequestOptions extends RequestInit {
  auth?: boolean; // 기본 true, 로그인 등은 false로 사용
}

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { auth = true, headers, ...rest } = options;

  const token = auth ? getAccessToken() : null;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  if (auth && token) {
    (finalHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (!res.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await res.json();
    } catch {
      // ignore
    }

    let message = `API 요청 실패 (${res.status})`;
    if (
      errorBody &&
      typeof errorBody === "object" &&
      "message" in errorBody &&
      typeof (errorBody as { message?: unknown }).message === "string"
    ) {
      message = (errorBody as { message: string }).message;
    }

    const error = new Error(message);
    // @ts-expect-error 추가 정보 필드(status)는 런타임에서만 사용
    error.status = res.status;
    // @ts-expect-error 추가 정보 필드(body)는 런타임에서만 사용
    error.body = errorBody;
    throw error;
  }

  try {
    return (await res.json()) as T;
  } catch {
    // JSON 응답이 아닐 수도 있으므로 null을 허용
    // @ts-expect-error - 호출부에서 null 가능성을 함께 처리
    return null;
  }
};


