// services/season/seasonService.ts

import {
  getAllSeasonsApi,
  Season,
  getSeasonByIdApi,
  createSeasonApi,
  CreateSeasonPayload,
  CreateSeasonResponse,
} from "@/api/seasonApi";

// ======================================================
// GET ALL SEASONS
// ======================================================

export const getAllSeasons = async (): Promise<Season[]> => {
  return await getAllSeasonsApi();
};

// ======================================================
// GET SINGLE SEASON
// ======================================================

export const getSeasonById = async (seasonId: string): Promise<Season> => {
  return await getSeasonByIdApi(seasonId);
};

// ======================================================
// CREATE SEASON
// ======================================================

export const createSeason = async (
  data: CreateSeasonPayload,
): Promise<CreateSeasonResponse> => {
  return await createSeasonApi(data);
};
