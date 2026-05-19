// services/adminService.ts

import {
  createAdminApi,
  CreateAdminResponse,
  deleteAdminApi,
  DeleteAdminResponse,
  getAllAdminsApi,
  GetAllAdminsResponse,
  getAdminByIdApi,
  GetAdminResponse,
  updateAdminApi,
  UpdateAdminResponse,
  Admin,
} from "@/api/adminApi";

// ======================================================
// SERVICES
// ======================================================

// CREATE ADMIN
export const createAdmin = async (
  data: FormData,
): Promise<CreateAdminResponse> => {
  return await createAdminApi(data);
};

// GET ALL ADMINS
export const getAllAdmins = async (): Promise<GetAllAdminsResponse> => {
  return await getAllAdminsApi();
};

// GET ADMIN BY ID
export const getAdminById = async (
  adminId: string,
): Promise<GetAdminResponse> => {
  return await getAdminByIdApi(adminId);
};

// UPDATE ADMIN
export const updateAdmin = async (
  adminId: string,
  data: Partial<Admin>,
): Promise<UpdateAdminResponse> => {
  return await updateAdminApi(adminId, data);
};

// DELETE ADMIN
export const deleteAdmin = async (
  adminId: string,
): Promise<DeleteAdminResponse> => {
  return await deleteAdminApi(adminId);
};
