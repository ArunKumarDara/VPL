// models/Auction.js

import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
    },

    startingPrice: {
      type: Number,
      required: true,
    },

    currentBid: {
      type: Number,
      default: 0,
    },

    winningTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    bidHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],

    status: {
      type: String,
      enum: ["UPCOMING", "LIVE", "SOLD", "UNSOLD"],
      default: "UPCOMING",
    },

    soldAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Auction", auctionSchema);
