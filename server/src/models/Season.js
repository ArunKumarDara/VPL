// models/Season.js

import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    auctionDate: {
      type: Date,
    },

    tournamentStartDate: {
      type: Date,
    },

    tournamentEndDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "LIVE", "COMPLETED"],
      default: "UPCOMING",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Season", seasonSchema);
