// controllers/teamController.js

import mongoose from "mongoose";

import Team from "../models/Team.js";
import Owner from "../models/Owner.js";
import Player from "../models/Player.js";
import Season from "../models/Season.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// ======================================================
// CREATE TEAM
// ======================================================

export const createTeam = async (req, res) => {
  try {
    const { name, ownerName, maxPlayers, season } = req.body;

    // Validation
    if (!name || !ownerName || !season) {
      return res.status(400).json({
        success: false,
        message: "Name, owner and season are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    // Check existing team
    const existingTeam = await Team.findOne({ name });

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: "Team already exists",
      });
    }

    // Check owner
    const owner = await Owner.findById(ownerName);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    // Check season
    const existingSeason = await Season.findById(season);

    if (!existingSeason) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    const uploadedImage = await uploadToCloudinary(req.file.buffer);

    // Create team
    const team = await Team.create({
      name,
      profileImage: uploadedImage.secure_url,
      ownerName,
      maxPlayers,
      season,
    });

    await Season.findByIdAndUpdate(
      season,
      {
        $push: {
          teams: team._id,
        },
      },
      {
        new: true,
      },
    );

    await Owner.findByIdAndUpdate(
      owner._id,
      {
        team: team._id,
      },
      {
        new: true,
      },
    );

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    console.log("Create Team Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create team",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL TEAMS
// ======================================================

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("ownerName", "name email purseAmount")
      .populate("players")
      .populate("season");

    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    console.log("Get Teams Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE TEAM
// ======================================================

export const getSingleTeam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID",
      });
    }

    const team = await Team.findById(id)
      .populate("ownerName", "name email purseAmount")
      .populate("players")
      .populate("season");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      team,
    });
  } catch (error) {
    console.log("Get Single Team Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch team",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE TEAM
// ======================================================

export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, logo, ownerName, maxPlayers, season } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID",
      });
    }

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Check owner if updating
    if (ownerName) {
      const owner = await Owner.findById(ownerName);

      if (!owner) {
        return res.status(404).json({
          success: false,
          message: "Owner not found",
        });
      }
    }

    // Check season if updating
    if (season) {
      const existingSeason = await Season.findById(season);

      if (!existingSeason) {
        return res.status(404).json({
          success: false,
          message: "Season not found",
        });
      }
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      {
        name,
        logo,
        ownerName,
        maxPlayers,
        season,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("ownerName", "name email purseAmount")
      .populate("players")
      .populate("season");

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.log("Update Team Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update team",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE TEAM
// ======================================================

export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid team ID",
      });
    }

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    await Team.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.log("Delete Team Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete team",
      error: error.message,
    });
  }
};

// ======================================================
// ADD PLAYER TO TEAM
// ======================================================

export const addPlayerToTeam = async (req, res) => {
  try {
    const { teamId, playerId } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    // Check max players
    if (team.players.length >= team.maxPlayers) {
      return res.status(400).json({
        success: false,
        message: "Team already reached max player limit",
      });
    }

    // Prevent duplicate players
    if (team.players.includes(playerId)) {
      return res.status(400).json({
        success: false,
        message: "Player already added to team",
      });
    }

    team.players.push(playerId);

    await team.save();

    res.status(200).json({
      success: true,
      message: "Player added successfully",
      team,
    });
  } catch (error) {
    console.log("Add Player Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add player",
      error: error.message,
    });
  }
};

// ======================================================
// REMOVE PLAYER FROM TEAM
// ======================================================

export const removePlayerFromTeam = async (req, res) => {
  try {
    const { teamId, playerId } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    team.players = team.players.filter(
      (player) => player.toString() !== playerId,
    );

    await team.save();

    res.status(200).json({
      success: true,
      message: "Player removed successfully",
      team,
    });
  } catch (error) {
    console.log("Remove Player Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove player",
      error: error.message,
    });
  }
};
