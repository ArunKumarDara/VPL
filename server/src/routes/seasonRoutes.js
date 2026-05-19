// routes/seasonRoutes.js

import express from "express";

import {
  createSeason,
  getAllSeasons,
  getSingleSeason,
  updateSeason,
  deleteSeason,
  updateSeasonStatus,
} from "../controllers/seasonController.js";

const router = express.Router();

// ======================================================
// CREATE SEASON
// POST /api/v1/seasons
// ======================================================

router.post("/", createSeason);

// ======================================================
// GET ALL SEASONS
// GET /api/v1/seasons
// ======================================================

router.get("/", getAllSeasons);

// ======================================================
// GET SINGLE SEASON
// GET /api/v1/seasons/:id
// ======================================================

router.get("/:id", getSingleSeason);

// ======================================================
// UPDATE SEASON
// PUT /api/v1/seasons/:id
// ======================================================

router.put("/:id", updateSeason);

// ======================================================
// DELETE SEASON
// DELETE /api/v1/seasons/:id
// ======================================================

router.delete("/:id", deleteSeason);

// ======================================================
// UPDATE SEASON STATUS
// PATCH /api/v1/seasons/:id/status
// ======================================================

router.patch("/:id/status", updateSeasonStatus);

export default router;
