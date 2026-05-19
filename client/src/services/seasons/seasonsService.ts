// services/season/seasonService.ts

import { getAllSeasonsApi, Season } from "@/api/seasonApi";

// ======================================================
// SERVICE
// ======================================================

export const getAllSeasons = async (): Promise<Season[]> => {
  return await getAllSeasonsApi();
};
