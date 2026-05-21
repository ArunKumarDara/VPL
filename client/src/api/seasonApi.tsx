// src/api/seasonApi.ts

import api from "./axios";

// ======================================================
// TYPES
// ======================================================

export type Owner = {
    _id: string;
    name: string;
    email?: string;
    mobile?: string;
    profileImage?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type Team = {
    _id: string;
    name: string;
    shortName?: string;
    logo?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type Player = {
    _id: string;
    name: string;
    role?: string;
    playerType?: string;
    basePrice?: number;
    profileImage?: string;
    createdAt?: string;
    updatedAt?: string;
};

// ======================================================
// SEASON TYPE
// ======================================================

export type Season = {
    _id: string;

    title: string;

    year: number;

    auctionDate?: string;

    tournamentStartDate?: string;

    tournamentEndDate?: string;

    status: "UPCOMING" | "LIVE" | "COMPLETED";

    registeredPlayers: Player[];

    owners: Owner[];

    teams: Team[];

    players: Player[];

    createdAt: string;

    updatedAt: string;
};

// ======================================================
// CREATE SEASON TYPES
// ======================================================

export type CreateSeasonPayload = {
    title: string;
    year: number;

    auctionDate?: string;

    tournamentStartDate?: string;

    tournamentEndDate?: string;

};

export type CreateSeasonResponse = {
    success: boolean;
    message: string;
    season: Season;
};

// ======================================================
// GET ALL SEASONS
// ======================================================

export const getAllSeasonsApi = async (): Promise<Season[]> => {
    const response = await api.get("/seasons");

    return response.data.seasons;
};

// ======================================================
// GET SINGLE SEASON
// ======================================================

export const getSeasonByIdApi = async (
    seasonId: string,
): Promise<Season> => {
    const response = await api.get(`/seasons/${seasonId}`);

    return response.data.season;
};

// ======================================================
// CREATE SEASON
// ======================================================

export const createSeasonApi = async (
    data: CreateSeasonPayload,
): Promise<CreateSeasonResponse> => {
    const response =
        await api.post<CreateSeasonResponse>(
            "/seasons",
            data,
        );

    return response.data;
};