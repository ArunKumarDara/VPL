// controllers/auctionController.js

import mongoose from "mongoose";

import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import Player from "../models/Player.js";
import Team from "../models/Team.js";
import Owner from "../models/Owner.js";

// ======================================================
// CREATE AUCTION
// ======================================================

export const createAuction = async (req, res) => {
  try {
    const { player, season, startingPrice } = req.body;

    // Validate player
    const existingPlayer = await Player.findById(player);

    if (!existingPlayer) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    // Prevent duplicate auction
    const existingAuction = await Auction.findOne({
      player,
      season,
    });

    if (existingAuction) {
      return res.status(400).json({
        success: false,
        message: "Auction already created for this player",
      });
    }

    const auction = await Auction.create({
      player,
      season,
      startingPrice,
      currentBid: startingPrice,
    });

    return res.status(201).json({
      success: true,
      message: "Auction created successfully",
      auction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// START AUCTION
// ======================================================

export const startAuction = async (req, res) => {
  try {
    const { auctionId } = req.body;

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    auction.status = "LIVE";

    await auction.save();

    return res.status(200).json({
      success: true,
      message: "Auction started",
      auction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// PLACE BID
// ======================================================

export const placeBid = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { auctionId, teamId, amount } = req.body;

    // =====================================
    // FIND AUCTION
    // =====================================

    const auction = await Auction.findById(auctionId).session(session);

    if (!auction) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Auction must be LIVE
    if (auction.status !== "LIVE") {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Auction is not live",
      });
    }

    // =====================================
    // FIND TEAM
    // =====================================

    const team = await Team.findById(teamId).populate("owner");

    if (!team) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // =====================================
    // FIND OWNER
    // =====================================

    const owner = await Owner.findById(team.owner._id).session(session);

    if (!owner) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    // =====================================
    // BID VALIDATION
    // =====================================

    if (amount <= auction.currentBid) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Bid amount must be greater than current bid",
      });
    }

    // Purse validation
    if (owner.remainingPurse < amount) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Owner has insufficient purse balance",
      });
    }

    // =====================================
    // CREATE BID
    // =====================================

    const bid = await Bid.create(
      [
        {
          auction: auction._id,
          team: team._id,
          player: auction.player,
          bidAmount: amount,
        },
      ],
      { session },
    );

    // =====================================
    // UPDATE AUCTION
    // =====================================

    auction.currentBid = amount;

    auction.winningTeam = team._id;

    auction.bidHistory.push(bid[0]._id);

    await auction.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Bid placed successfully",
      bid: bid[0],
      auction,
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// ======================================================
// FINALIZE AUCTION
// ======================================================

export const finalizeAuction = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { auctionId } = req.body;

    // =====================================
    // FIND AUCTION
    // =====================================

    const auction = await Auction.findById(auctionId)
      .populate("player")
      .populate("winningTeam")
      .session(session);

    if (!auction) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Already finalized
    if (auction.status === "SOLD" || auction.status === "UNSOLD") {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Auction already finalized",
      });
    }

    // =====================================
    // UNSOLD CASE
    // =====================================

    if (!auction.winningTeam) {
      auction.status = "UNSOLD";

      await auction.save({ session });

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: "Player remained unsold",
      });
    }

    // =====================================
    // FIND PLAYER
    // =====================================

    const player = await Player.findById(auction.player._id).session(session);

    // =====================================
    // FIND TEAM
    // =====================================

    const team = await Team.findById(auction.winningTeam._id)
      .populate("owner")
      .session(session);

    // =====================================
    // FIND OWNER
    // =====================================

    const owner = await Owner.findById(team.owner._id).session(session);

    // =====================================
    // VALIDATION
    // =====================================

    if (owner.remainingPurse < auction.currentBid) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Owner purse balance insufficient",
      });
    }

    // =====================================
    // UPDATE PLAYER
    // =====================================

    player.soldStatus = "SOLD";

    player.soldPrice = auction.currentBid;

    player.currentTeam = team._id;

    player.auctionStatus = "COMPLETED";

    await player.save({ session });

    // =====================================
    // UPDATE TEAM
    // =====================================

    team.players.push(player._id);

    await team.save({ session });

    // =====================================
    // UPDATE OWNER PURSE
    // =====================================

    owner.remainingPurse = owner.remainingPurse - auction.currentBid;

    owner.totalSpent = owner.totalSpent + auction.currentBid;

    owner.boughtPlayers.push(player._id);

    await owner.save({ session });

    // =====================================
    // UPDATE AUCTION
    // =====================================

    auction.status = "SOLD";

    auction.soldAt = new Date();

    await auction.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Auction finalized successfully",
      data: {
        auction,
        player,
        team,
        owner,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// ======================================================
// GET ALL AUCTIONS
// ======================================================

export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate("player")
      .populate("winningTeam")
      .populate("season")
      .populate({
        path: "bidHistory",
        populate: {
          path: "team",
        },
      });

    return res.status(200).json({
      success: true,
      totalAuctions: auctions.length,
      auctions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET SINGLE AUCTION
// ======================================================

export const getSingleAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("player")
      .populate("winningTeam")
      .populate("season")
      .populate({
        path: "bidHistory",
        populate: {
          path: "team",
        },
      });

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    return res.status(200).json({
      success: true,
      auction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
