// routes/ownerRoutes.js

import express from "express";

import {
  createOwner,
  getAllOwners,
  getSingleOwner,
  buyPlayer,
  getOwnerPurseDetails,
} from "../controllers/ownerController.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", upload.single("profileImage"), createOwner);

router.get("/", getAllOwners);

router.get("/:id", getSingleOwner);

router.post("/buy-player", buyPlayer);

router.get("/:id/purse", getOwnerPurseDetails);

export default router;
