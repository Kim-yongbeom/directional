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
    let errorBody: any = null;
    try {
      errorBody = await res.json();
    } catch {
      // ignore
    }

    const message =
      (errorBody && (errorBody.message as string)) ||
      `API 요청 실패 (${res.status})`;

    const error = new Error(message);
    // @ts-expect-error 추가 정보
    error.status = res.status;
    // @ts-expect-error 추가 정보
    error.body = errorBody;
    throw error;
  }

  try {
    return (await res.json()) as T;
  } catch {
    // @ts-expect-error
    return null;
  }
};


