// services/season/seasonService.ts

import { getAllSeasonsApi, Season, getSeasonByIdApi } from "@/api/seasonApi";

// ======================================================
// SERVICE
// ======================================================

export const getAllSeasons = async (): Promise<Season[]> => {
  return await getAllSeasonsApi();
};

export const getSeasonById = async (seasonId: string): Promise<Season> => {
  return await getSeasonByIdApi(seasonId);
};
