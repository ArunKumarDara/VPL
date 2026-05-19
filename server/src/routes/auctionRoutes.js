// routes/auctionRoutes.js

import express from "express";

import {
  createAuction,
  startAuction,
  placeBid,
  finalizeAuction,
  getAllAuctions,
  getSingleAuction,
} from "../controllers/auctionController.js";

const router = express.Router();

router.post("/", createAuction);

router.post("/start", startAuction);

router.post("/bid", placeBid);

router.post("/finalize", finalizeAuction);

router.get("/", getAllAuctions);

router.get("/:id", getSingleAuction);

export default router;
