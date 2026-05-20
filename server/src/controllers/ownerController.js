// controllers/ownerController.js

import Owner from "../models/Owner.js";
import Team from "../models/Team.js";
import Player from "../models/Player.js";
import Season from "../models/Season.js";

import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// ======================================================
// CREATE OWNER
// ======================================================

export const createOwner = async (req, res) => {
  try {
    const { name, village, mobile, purseValue, season } = req.body;

    if (!name || !village || !purseValue) {
      return res.status(400).json({
        success: false,
        message: "name, village and basePrice are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Owner image is required",
      });
    }

    const existingOwner = await Owner.findOne({
      mobile,
    });

    if (existingOwner) {
      return res.status(400).json({
        success: false,
        message:
          "Owner already exists. please Login with Registered Mobile Number!!",
      });
    }

    const existingSeason = await Season.findById(season);

    if (!existingSeason) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    const uploadedImage = await uploadToCloudinary(req.file.buffer);

    const owner = await Owner.create({
      name,
      profileImage: uploadedImage.secure_url,
      village,
      mobile,
      purseValue,
      season,
    });

    await Season.findByIdAndUpdate(
      season,
      {
        $push: {
          owners: owner._id,
        },
      },
      {
        new: true,
      },
    );

    return res.status(201).json({
      success: true,
      message:
        "Owner created successfully. please Login with Registered Mobile Number!!",
      owner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL OWNERS
// ======================================================

export const getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.find()
      .populate("team")
      .populate("boughtPlayers")
      .populate("season");
    console.log(owners);
    return res.status(200).json({
      success: true,
      totalOwners: owners.length,
      owners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET SINGLE OWNER
// ======================================================

export const getSingleOwner = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id)
      .populate("team")
      .populate("boughtPlayers")
      .populate("season");

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    return res.status(200).json({
      success: true,
      owner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// BUY PLAYER
// ======================================================

export const buyPlayer = async (req, res) => {
  try {
    const { ownerId, playerId, amount } = req.body;

    // =====================================
    // FIND OWNER
    // =====================================

    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    // =====================================
    // FIND PLAYER
    // =====================================

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    // =====================================
    // VALIDATIONS
    // =====================================

    if (player.soldStatus === "SOLD") {
      return res.status(400).json({
        success: false,
        message: "Player already sold",
      });
    }

    if (owner.remainingPurse < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient purse balance",
      });
    }

    // =====================================
    // FIND TEAM
    // =====================================

    const team = await Team.findById(owner.team);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found for this owner",
      });
    }

    // =====================================
    // UPDATE PLAYER
    // =====================================

    player.soldStatus = "SOLD";
    player.soldPrice = amount;
    player.currentTeam = team._id;

    await player.save();

    // =====================================
    // UPDATE OWNER
    // =====================================

    owner.remainingPurse = owner.remainingPurse - amount;

    owner.totalSpent = owner.totalSpent + amount;

    owner.boughtPlayers.push(player._id);

    await owner.save();

    // =====================================
    // UPDATE TEAM
    // =====================================

    team.players.push(player._id);

    await team.save();

    return res.status(200).json({
      success: true,
      message: "Player bought successfully",
      data: {
        owner,
        player,
        team,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET OWNER PURSE DETAILS
// ======================================================

export const getOwnerPurseDetails = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    return res.status(200).json({
      success: true,
      purseDetails: {
        purseValue: owner.purseValue,
        remainingPurse: owner.remainingPurse,
        totalSpent: owner.totalSpent,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
