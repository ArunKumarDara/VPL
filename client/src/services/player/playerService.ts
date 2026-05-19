import { registerPlayerApi, RegisterPlayerResponse } from "@/api/playerApi";

// ======================================================
// SERVICE
// ======================================================

export const registerPlayer = async (
  data: FormData,
): Promise<RegisterPlayerResponse> => {
  return await registerPlayerApi(data);
};
