// services/team/teamApi.ts

import api from "./axios";

// ======================================================
// TYPES
// ======================================================

export type Team = {
  _id: string;

  name: string;

  logo?: string;

  ownerName: {
    _id: string;
    name: string;
  };

  maxPlayers: number;

  players: {
    _id: string;
    name: string;
  }[];

  season: {
    _id: string;
    title: string;
  };

  createdAt: string;

  updatedAt: string;
};

export type CreateTeamResponse = {
  success: boolean;
  message: string;
  team: Team;
};

export type GetAllTeamsResponse = {
  success: boolean;
  totalTeams: number;
  teams: Team[];
  count: number;
};

export type GetSingleTeamResponse = {
  success: boolean;
  team: Team;
};

// ======================================================
// CREATE TEAM
// ======================================================

export const createTeamApi = async (
  data: FormData,
): Promise<CreateTeamResponse> => {
  const response = await api.post<CreateTeamResponse>("/teams", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ======================================================
// GET ALL TEAMS
// ======================================================

export const getAllTeamsApi = async (): Promise<GetAllTeamsResponse> => {
  const response = await api.get<GetAllTeamsResponse>("/teams");

  return response.data;
};

// ======================================================
// GET SINGLE TEAM
// ======================================================

export const getSingleTeamApi = async (
  id: string,
): Promise<GetSingleTeamResponse> => {
  const response = await api.get<GetSingleTeamResponse>(`/teams/${id}`);

  return response.data;
};
