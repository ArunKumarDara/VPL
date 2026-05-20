// models/Team.js

import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    profileImage: {
      type: String,
    },
    ownerName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
      default: null,
    },

    maxPlayers: {
      type: Number,
      default: 17,
    },

    players: [
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

export default mongoose.model("Team", teamSchema);
