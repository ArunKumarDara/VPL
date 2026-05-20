import api from "./axios";

export type LoginRequest = {
  mobile: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  token: string;

  user: {
    _id: string;
    name: string;
    mobile: string;
    profileImage: string;
    role: "PLAYER" | "OWNER" | "ADMIN";
  };
};

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};
