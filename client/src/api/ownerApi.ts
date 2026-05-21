// api/ownerApi.ts

import api from "./axios";
import { Team } from "./seasonApi";

// ======================================================
// TYPES
// ======================================================

export type Owner = {
  _id: string;
  name: string;
  profileImage: string;
  village: string;
  mobile: string;
  purseValue: number;
  remainingPurse: number;
  totalSpent: number;
  team: string | null;
  boughtPlayers: string[];
  season: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateOwnerResponse = {
  success: boolean;
  message: string;
  data: Owner;
};

export type GetAllOwnersResponse = {
  success: boolean;
  totalOwners: number;
  data: Owner[];
};

export type GetOwnerResponse = {
  success: boolean;
  data: Owner;
};

export type UpdateOwnerResponse = {
  success: boolean;
  message: string;
  data: Owner;
};

export type DeleteOwnerResponse = {
  success: boolean;
  message: string;
};

export type BuyPlayerResponse = {
  success: boolean;
  message: string;
  data: Owner;
  team: Team;
};

// ======================================================
// API CALLS
// ======================================================

// CREATE OWNER
export const createOwnerApi = async (
  data: FormData,
): Promise<CreateOwnerResponse> => {
  const response = await api.post<CreateOwnerResponse>("/owners", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// GET ALL OWNERS
export const getAllOwnersApi = async () => {
  const response = await api.get("/owners");

  return response.data;
};

// GET OWNER BY ID
export const getOwnerByIdApi = async (
  ownerId: string,
): Promise<GetOwnerResponse> => {
  const response = await api.get<GetOwnerResponse>(`/owners/${ownerId}`);

  return response.data;
};

// UPDATE OWNER
export const updateOwnerApi = async (
  ownerId: string,
  data: Partial<Owner>,
): Promise<UpdateOwnerResponse> => {
  const response = await api.put<UpdateOwnerResponse>(
    `/owners/${ownerId}`,
    data,
  );

  return response.data;
};

// DELETE OWNER
export const deleteOwnerApi = async (
  ownerId: string,
): Promise<DeleteOwnerResponse> => {
  const response = await api.delete<DeleteOwnerResponse>(`/owners/${ownerId}`);

  return response.data;
};

// BUY PLAYER
export const buyPlayerApi = async (
  ownerId: string,
  playerId: string,
  amount: number,
): Promise<BuyPlayerResponse> => {
  const response = await api.put<BuyPlayerResponse>(`/owners/buy-player`, {
    playerId,
    amount,
    ownerId,
  });

  return response.data;
};
