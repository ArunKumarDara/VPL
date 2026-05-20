// src/services/player/playerService.ts

import {
  registerPlayerApi,
  getAllPlayersApi,
  getSinglePlayerApi,
  updatePlayerApi,
  deletePlayerApi,
  CommonResponse,
  RegisterPlayerResponse,
  UpdatePlayerResponse,
  GetAllPlayersResponse,
  GetSinglePlayerResponse,
} from "@/api/playerApi";

// ======================================================
// REGISTER PLAYER
// ======================================================

export const registerPlayer = async (
  data: FormData,
): Promise<RegisterPlayerResponse> => {
  return await registerPlayerApi(data);
};

// ======================================================
// GET ALL PLAYERS
// ======================================================

export const getAllPlayers = async (): Promise<GetAllPlayersResponse> => {
  return await getAllPlayersApi();
};

// ======================================================
// GET SINGLE PLAYER
// ======================================================

export const getSinglePlayer = async (
  id: string,
): Promise<GetSinglePlayerResponse> => {
  return await getSinglePlayerApi(id);
};

// ======================================================
// UPDATE PLAYER
// ======================================================

export const updatePlayer = async (
  id: string,
  data: FormData,
): Promise<UpdatePlayerResponse> => {
  return await updatePlayerApi(id, data);
};

// ======================================================
// DELETE PLAYER
// ======================================================

export const deletePlayer = async (id: string): Promise<CommonResponse> => {
  return await deletePlayerApi(id);
};
