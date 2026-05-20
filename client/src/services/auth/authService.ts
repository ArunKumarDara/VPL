import { loginApi, LoginRequest, LoginResponse } from "@/api/authApi";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  return await loginApi(data);
};
