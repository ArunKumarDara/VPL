import bcrypt from "bcryptjs";

import Player from "../models/Player.js";
import Owner from "../models/Owner.js";
import Admin from "../models/Admin.js";

import generateToken from "../utils/generateToken.js";

// =====================================
// LOGIN
// =====================================

export const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number required",
      });
    }

    let user = null;
    let role = null;

    // =====================================
    // PLAYER
    // =====================================

    user = await Player.findOne({
      mobile,
    });

    if (user) {
      role = "PLAYER";
    }

    // =====================================
    // OWNER
    // =====================================

    if (!user) {
      user = await Owner.findOne({
        mobile,
      });

      if (user) {
        role = "OWNER";
      }
    }

    // =====================================
    // ADMIN
    // =====================================

    if (!user) {
      user = await Admin.findOne({
        mobile,
      });

      if (user) {
        role = "ADMIN";
      }
    }

    // =====================================
    // NOT FOUND
    // =====================================

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =====================================
    // PLAYER LOGIN
    // no password required
    // =====================================

    if (role === "PLAYER") {
      const token = generateToken(user._id, role);

      return res.status(200).json({
        success: true,
        token,

        user: {
          _id: user._id,
          name: user.name,
          mobile: user.mobile,
          profileImage: user.profileImage,
          role,
        },
      });
    }

    // =====================================
    // OWNER + ADMIN PASSWORD CHECK
    // =====================================

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password required",
      });
    }

    if (password !== "RPLSEASON1") {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id, role);

    return res.status(200).json({
      success: true,
      token,

      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        profileImage: user.profileImage,
        role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
