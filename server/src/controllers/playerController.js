// controllers/playerController.js

import Player from "../models/Player.js";
import Season from "../models/Season.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// ======================================================
// CREATE PLAYER
// ======================================================

export const createPlayer = async (req, res) => {
  try {
    const { name, village, mobile, basePrice, season, playingRole } = req.body;

    if (!name || !village || !basePrice) {
      return res.status(400).json({
        success: false,
        message: "name, village and basePrice are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    // Check existing player
    const existingPlayer = await Player.findOne({
      mobile,
    });

    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message:
          "Player already exists. please Login with Registered Mobile Number!!",
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

    // Create player
    const player = await Player.create({
      name,
      profileImage: uploadedImage.secure_url,
      village,
      mobile,
      basePrice,
      season,
      playingRole,
    });

    await Season.findByIdAndUpdate(
      season,
      {
        $push: {
          registeredPlayers: player._id,
        },
      },
      {
        new: true,
      },
    );

    return res.status(201).json({
      success: true,
      message:
        "Player created successfully. please Login with Registered Mobile Number!!",
      player,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL PLAYERS
// ======================================================

export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find()
      .populate("currentTeam")
      .populate("season")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalPlayers: players.length,
      players,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET SINGLE PLAYER
// ======================================================

export const getSinglePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    const player = await Player.findById(id)
      .populate("currentTeam")
      .populate("season");

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    return res.status(200).json({
      success: true,
      player,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// UPDATE PLAYER
// ======================================================

export const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    const updatedPlayer = await Player.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Player updated successfully",
      player: updatedPlayer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// DELETE PLAYER
// ======================================================

export const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    const player = await Player.findById(id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    // Prevent deleting sold players
    if (player.soldStatus === "SOLD") {
      return res.status(400).json({
        success: false,
        message: "Sold player cannot be deleted",
      });
    }

    await Player.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Player deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET UNSOLD PLAYERS
// ======================================================

export const getUnsoldPlayers = async (req, res) => {
  try {
    const players = await Player.find({
      soldStatus: "UNSOLD",
    }).sort({
      basePrice: 1,
    });

    return res.status(200).json({
      success: true,
      totalPlayers: players.length,
      players,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET SOLD PLAYERS
// ======================================================

export const getSoldPlayers = async (req, res) => {
  try {
    const players = await Player.find({
      soldStatus: "SOLD",
    })
      .populate("currentTeam")
      .sort({
        soldPrice: -1,
      });

    return res.status(200).json({
      success: true,
      totalPlayers: players.length,
      players,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
