// models/Player.js

import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    village: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    playingRole: {
      type: String,
      required: true,
    },

    basePrice: {
      type: Number,
      required: true,
    },

    soldPrice: {
      type: Number,
      default: 0,
    },

    soldStatus: {
      type: String,
      enum: ["UNSOLD", "SOLD"],
      default: "UNSOLD",
    },

    currentTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    ownerName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      default: null,
    },

    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
    },

    auctionStatus: {
      type: String,
      enum: ["PENDING", "LIVE", "COMPLETED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Player", playerSchema);
