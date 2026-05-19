// routes/playerRoutes.js

import express from "express";

import {
  createPlayer,
  getAllPlayers,
  getSinglePlayer,
  updatePlayer,
  deletePlayer,
  getSoldPlayers,
  getUnsoldPlayers,
} from "../controllers/playerController.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

// ======================================================
// CREATE PLAYER
// POST /api/v1/players
// ======================================================

router.post("/register", upload.single("profileImage"), createPlayer);

// ======================================================
// GET ALL PLAYERS
// GET /api/v1/players
// ======================================================

router.get("/", getAllPlayers);

// ======================================================
// GET SOLD PLAYERS
// GET /api/v1/players/sold
// ======================================================

router.get("/sold", getSoldPlayers);

// ======================================================
// GET UNSOLD PLAYERS
// GET /api/v1/players/unsold
// ======================================================

router.get("/unsold", getUnsoldPlayers);

// ======================================================
// GET SINGLE PLAYER
// GET /api/v1/players/:id
// ======================================================

router.get("/:id", getSinglePlayer);

// ======================================================
// UPDATE PLAYER
// PUT /api/v1/players/:id
// ======================================================

router.put("/:id", updatePlayer);

// ======================================================
// DELETE PLAYER
// DELETE /api/v1/players/:id
// ======================================================

router.delete("/:id", deletePlayer);

export default router;
