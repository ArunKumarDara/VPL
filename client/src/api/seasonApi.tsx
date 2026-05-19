// src/api/seasonApi.ts

import api from "./axios";

// ======================================================
// TYPES
// ======================================================

export type Season = {
    _id: string;
    title: string;
    year: number;
    auctionDate?: string;
    tournamentStartDate?: string;
    tournamentEndDate?: string;
    status: "UPCOMING" | "LIVE" | "COMPLETED";
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