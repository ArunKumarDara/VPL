// controllers/seasonController.js

import Season from "../models/Season.js";

// ======================================================
// CREATE SEASON
// ======================================================

export const createSeason = async (req, res) => {
  try {
    const {
      title,
      year,
      auctionDate,
      tournamentStartDate,
      tournamentEndDate,
      status,
    } = req.body;

    // Validation
    if (!title || !year) {
      return res.status(400).json({
        success: false,
        message: "Title and year are required",
      });
    }

    // Prevent duplicate year season
    const existingSeason = await Season.findOne({
      year,
    });

    if (existingSeason) {
      return res.status(400).json({
        success: false,
        message: "Season already exists for this year",
      });
    }

    // Create season
    const season = await Season.create({
      title,
      year,
      auctionDate,
      tournamentStartDate,
      tournamentEndDate,
      status,
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
    const seasons = await Season.find().sort({
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

    const season = await Season.findById(id);

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

    const season = await Season.findById(id);

    if (!season) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    const updatedSeason = await Season.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

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

    // Validation
    const allowedStatus = ["UPCOMING", "LIVE", "COMPLETED"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid season status",
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
