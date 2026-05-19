import api from "./axios";

// ======================================================
// TYPES
// ======================================================

export type RegisterPlayerResponse = {
  success: boolean;
  message: string;
};

// ======================================================
// API CALL
// ======================================================

export const registerPlayerApi = async (
  data: FormData,
): Promise<RegisterPlayerResponse> => {
  const response = await api.post<RegisterPlayerResponse>(
    "/players/register",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
