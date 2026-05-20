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

    // RELATIONS

    registeredPlayers: Player[];

    owners: Owner[];

    teams: Team[];

    players: Player[];

    createdAt: string;

    updatedAt: string;
};


// ======================================================
// GET ALL SEASONS
// ======================================================

export const getAllSeasonsApi = async (): Promise<Season[]> => {
    const response = await api.get("/seasons");

    return response.data.seasons;
};

export const getSeasonByIdApi = async (
    seasonId: string,
): Promise<Season> => {
    const response = await api.get(`/seasons/${seasonId}`);
    console.log(response)
    return response.data.season;
};