// models/Player.js

import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
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
    purseValue: {
      type: Number,
      default: 25000,
    },

    remainingPurse: {
      type: Number,
      default: 25000,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    boughtPlayers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],

    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Owner", ownerSchema);
