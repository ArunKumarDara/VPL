// services/ownerService.ts

import {
  buyPlayerApi,
  BuyPlayerResponse,
  createOwnerApi,
  CreateOwnerResponse,
  deleteOwnerApi,
  DeleteOwnerResponse,
  getAllOwnersApi,
  GetAllOwnersResponse,
  getOwnerByIdApi,
  GetOwnerResponse,
  updateOwnerApi,
  UpdateOwnerResponse,
  Owner,
} from "@/api/ownerApi";

// ======================================================
// SERVICES
// ======================================================

// CREATE OWNER
export const createOwner = async (
  data: FormData,
): Promise<CreateOwnerResponse> => {
  return await createOwnerApi(data);
};

// GET ALL OWNERS
export const getAllOwners = async (): Promise<GetAllOwnersResponse> => {
  return await getAllOwnersApi();
};

// GET OWNER BY ID
export const getOwnerById = async (
  ownerId: string,
): Promise<GetOwnerResponse> => {
  return await getOwnerByIdApi(ownerId);
};

// UPDATE OWNER
export const updateOwner = async (
  ownerId: string,
  data: Partial<Owner>,
): Promise<UpdateOwnerResponse> => {
  return await updateOwnerApi(ownerId, data);
};

// DELETE OWNER
export const deleteOwner = async (
  ownerId: string,
): Promise<DeleteOwnerResponse> => {
  return await deleteOwnerApi(ownerId);
};

// BUY PLAYER
export const buyPlayer = async (
  ownerId: string,
  playerId: string,
  amount: number,
): Promise<BuyPlayerResponse> => {
  return await buyPlayerApi(ownerId, playerId, amount);
};
