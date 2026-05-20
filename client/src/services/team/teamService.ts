// services/team/teamService.ts

import { createTeamApi, getAllTeamsApi, getSingleTeamApi } from "@/api/teamApi";

// ======================================================
// CREATE TEAM
// ======================================================

export const createTeam = async (data: FormData) => {
  const response = await createTeamApi(data);

  return response;
};

// ======================================================
// GET ALL TEAMS
// ======================================================

export const getAllTeams = async () => {
  const response = await getAllTeamsApi();
  console.log(response);
  return response;
};

// ======================================================
// GET SINGLE TEAM
// ======================================================

export const getSingleTeam = async (id: string) => {
  const response = await getSingleTeamApi(id);

  return response;
};
