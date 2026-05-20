// src/api/playerApi.ts

import api from "./axios";

// ======================================================
// TYPES
// ======================================================

export type Player = {
  _id: string;

  name: string;

  email?: string;

  mobile?: string;

  age?: number;

  role?: string;

  playerType?: string;

  battingStyle?: string;

  bowlingStyle?: string;

  basePrice?: number;

  profileImage?: string;

  createdAt?: string;

  updatedAt?: string;
};

// ======================================================
// COMMON RESPONSE
// ======================================================

export type CommonResponse = {
  success: boolean;
  message: string;
};

// ======================================================
// REGISTER PLAYER RESPONSE
// ======================================================

export type RegisterPlayerResponse = {
  success: boolean;
  message: string;
};

// ======================================================
// GET ALL PLAYERS RESPONSE
// ======================================================

export type GetAllPlayersResponse = {
  success: boolean;
  totalPlayers: number;
  players: Player[];
};

// ======================================================
// GET SINGLE PLAYER RESPONSE
// ======================================================

export type GetSinglePlayerResponse = {
  success: boolean;
  player: Player;
};

// ======================================================
// UPDATE PLAYER RESPONSE
// ======================================================

export type UpdatePlayerResponse = {
  success: boolean;
  message: string;
  player: Player;
};

// ======================================================
// REGISTER PLAYER
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

// ======================================================
// GET ALL PLAYERS
// ======================================================

export const getAllPlayersApi = async (): Promise<GetAllPlayersResponse> => {
  const response = await api.get<GetAllPlayersResponse>("/players");

  return response.data;
};

// ======================================================
// GET SINGLE PLAYER
// ======================================================

export const getSinglePlayerApi = async (
  id: string,
): Promise<GetSinglePlayerResponse> => {
  const response = await api.get<GetSinglePlayerResponse>(`/players/${id}`);

  return response.data;
};

// ======================================================
// UPDATE PLAYER
// ======================================================

export const updatePlayerApi = async (
  id: string,
  data: FormData,
): Promise<UpdatePlayerResponse> => {
  const response = await api.put<UpdatePlayerResponse>(`/players/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ======================================================
// DELETE PLAYER
// ======================================================

export const deletePlayerApi = async (id: string): Promise<CommonResponse> => {
  const response = await api.delete<CommonResponse>(`/players/${id}`);

  return response.data;
};
