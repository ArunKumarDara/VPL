// controllers/seasonController.js

import mongoose from "mongoose";

import Season from "../models/Season.js";

// ======================================================
// CREATE SEASON
// ======================================================

export const createSeason = async (req, res) => {
  try {
    const { title, year, auctionDate, tournamentStartDate, tournamentEndDate } =
      req.body;

    // VALIDATION

    if (!title || !year) {
      return res.status(400).json({
        success: false,
        message: "Title and year are required",
      });
    }

    // CHECK DUPLICATE YEAR

    const existingSeason = await Season.findOne({
      title: {
        $regex: `^${title.trim()}$`,
        $options: "i", // case-insensitive
      },
    });

    if (existingSeason) {
      return res.status(400).json({
        success: false,
        message: "Season already exists for this year",
      });
    }

    // CREATE SEASON

    const season = await Season.create({
      title,
      year,
      auctionDate,
      tournamentStartDate,
      tournamentEndDate,
    });

    return res.status(201).json({
      success: true,
      message: "Season created successfully",
      season,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL SEASONS
// ======================================================

export const getAllSeasons = async (req, res) => {
  try {
    const seasons = await Season.find()
      .populate("registeredPlayers")
      .populate("owners")
      .populate("teams")
      .sort({
        year: -1,
      });
    return res.status(200).json({
      success: true,
      totalSeasons: seasons.length,
      seasons,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET SINGLE SEASON
// ======================================================

export const getSingleSeason = async (req, res) => {
  try {
    const { id } = req.params;

    // VALID OBJECT ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid season id",
      });
    }

    const season = await Season.findById(id)
      .populate({
        path: "registeredPlayers",
        populate: {
          path: "currentTeam",
        },
      })
      .populate({
        path: "owners",
        populate: [
          {
            path: "team",
          },
          {
            path: "boughtPlayers",
          },
        ],
      })
      .populate("teams");

    if (!season) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    return res.status(200).json({
      success: true,
      season,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// UPDATE SEASON
// ======================================================

export const updateSeason = async (req, res) => {
  try {
    const { id } = req.params;

    // VALID OBJECT ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid season id",
      });
    }

    const season = await Season.findById(id);

    if (!season) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    // PREVENT DUPLICATE YEAR

    if (req.body.year) {
      const existingSeason = await Season.findOne({
        year: req.body.year,
        _id: {
          $ne: id,
        },
      });

      if (existingSeason) {
        return res.status(400).json({
          success: false,
          message: "Another season already exists for this year",
        });
      }
    }

    const updatedSeason = await Season.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("registeredPlayers")
      .populate("owners")
      .populate("teams")
      .populate("players");

    return res.status(200).json({
      success: true,
      message: "Season updated successfully",
      season: updatedSeason,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// DELETE SEASON
// ======================================================

export const deleteSeason = async (req, res) => {
  try {
    const { id } = req.params;

    // VALID OBJECT ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid season id",
      });
    }

    const season = await Season.findById(id);

    if (!season) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    await Season.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Season deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// UPDATE SEASON STATUS
// ======================================================

export const updateSeasonStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    // VALID STATUS

    const allowedStatus = ["UPCOMING", "LIVE", "COMPLETED"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid season status",
      });
    }

    // VALID OBJECT ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid season id",
      });
    }

    const season = await Season.findById(id);

    if (!season) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    season.status = status;

    await season.save();

    return res.status(200).json({
      success: true,
      message: "Season status updated",
      season,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ADD OWNER TO SEASON
// ======================================================

export const addOwnerToSeason = async (req, res) => {
  try {
    const { id } = req.params;

    const { ownerId } = req.body;

    const season = await Season.findById(id);

    if (!season) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    if (season.owners.includes(ownerId)) {
      return res.status(400).json({
        success: false,
        message: "Owner already added to season",
      });
    }

    season.owners.push(ownerId);

    await season.save();

    return res.status(200).json({
      success: true,
      message: "Owner added to season successfully",
      season,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ADD TEAM TO SEASON
// ======================================================

export const addTeamToSeason = async (req, res) => {
  try {
    const { id } = req.params;

    const { teamId } = req.body;

    const season = await Season.findById(id);

    if (!season) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    if (season.teams.includes(teamId)) {
      return res.status(400).json({
        success: false,
        message: "Team already added to season",
      });
    }

    season.teams.push(teamId);

    await season.save();

    return res.status(200).json({
      success: true,
      message: "Team added to season successfully",
      season,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ADD PLAYER TO SEASON
// ======================================================

export const addPlayerToSeason = async (req, res) => {
  try {
    const { id } = req.params;

    const { playerId } = req.body;

    const season = await Season.findById(id);

    if (!season) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    if (season.players.includes(playerId)) {
      return res.status(400).json({
        success: false,
        message: "Player already added to season",
      });
    }

    season.players.push(playerId);

    await season.save();

    return res.status(200).json({
      success: true,
      message: "Player added to season successfully",
      season,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
