// api/adminApi.ts

import api from "./axios";

// ======================================================
// TYPES
// ======================================================

export type Admin = {
  _id: string;
  name: string;
  profileImage: string;
  village: string;
  mobile: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateAdminResponse = {
  success: boolean;
  message: string;
  data: Admin;
};

export type GetAllAdminsResponse = {
  success: boolean;
  count: number;
  data: Admin[];
};

export type GetAdminResponse = {
  success: boolean;
  data: Admin;
};

export type UpdateAdminResponse = {
  success: boolean;
  message: string;
  data: Admin;
};

export type DeleteAdminResponse = {
  success: boolean;
  message: string;
};

// ======================================================
// API CALLS
// ======================================================

// CREATE ADMIN
export const createAdminApi = async (
  data: FormData,
): Promise<CreateAdminResponse> => {
  const response = await api.post<CreateAdminResponse>("/admins", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// GET ALL ADMINS
export const getAllAdminsApi = async (): Promise<GetAllAdminsResponse> => {
  const response = await api.get<GetAllAdminsResponse>("/admins");

  return response.data;
};

// GET ADMIN BY ID
export const getAdminByIdApi = async (
  adminId: string,
): Promise<GetAdminResponse> => {
  const response = await api.get<GetAdminResponse>(`/admins/${adminId}`);

  return response.data;
};

// UPDATE ADMIN
export const updateAdminApi = async (
  adminId: string,
  data: Partial<Admin>,
): Promise<UpdateAdminResponse> => {
  const response = await api.put<UpdateAdminResponse>(
    `/admins/${adminId}`,
    data,
  );

  return response.data;
};

// DELETE ADMIN
export const deleteAdminApi = async (
  adminId: string,
): Promise<DeleteAdminResponse> => {
  const response = await api.delete<DeleteAdminResponse>(`/admins/${adminId}`);

  return response.data;
};
