import { apiRequest, setAccessToken } from "./apiClient";

export interface LoginVariables {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginRequest = async (
  variables: LoginVariables
): Promise<LoginResponse> => {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false, // 로그인은 토큰 없이
    body: JSON.stringify(variables),
  });

  if (!data?.token) {
    throw new Error("accessToken이 응답에 없습니다.");
  }

  // 로그인 성공 시 토큰 저장
  setAccessToken(data.token);

  return data;
};
