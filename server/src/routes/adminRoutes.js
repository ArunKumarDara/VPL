// routes/adminRoutes.js

import express from "express";

import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

// ======================================================
// ROUTES
// ======================================================

// CREATE ADMIN
router.post("/", upload.single("profileImage"), createAdmin);

// GET ALL ADMINS
router.get("/", getAllAdmins);

// GET ADMIN BY ID
router.get("/:id", getAdminById);

// UPDATE ADMIN
router.put("/:id", updateAdmin);

// DELETE ADMIN
router.delete("/:id", deleteAdmin);

export default router;
