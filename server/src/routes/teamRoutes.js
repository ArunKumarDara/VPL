// routes/teamRoutes.js

import express from "express";

import {
  createTeam,
  getAllTeams,
  getSingleTeam,
  updateTeam,
  deleteTeam,
  addPlayerToTeam,
} from "../controllers/teamController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// ======================================================
// TEAM ROUTES
// ======================================================

// Create Team
router.post("/", upload.single("profileImage"), createTeam);

// Get All Teams
router.get("/", getAllTeams);

// Get Single Team
router.get("/:id", getSingleTeam);

// Update Team
router.put("/:id", updateTeam);

// Delete Team
router.delete("/:id", deleteTeam);

// Add Player To Team
router.post("/add-player", addPlayerToTeam);

export default router;
