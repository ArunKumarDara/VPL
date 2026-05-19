// controllers/adminController.js

import Admin from "../models/Admin.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
// ======================================================
// CREATE ADMIN
// ======================================================

export const createAdmin = async (req, res) => {
  try {
    const { name, mobile, village } = req.body;

    // Validation
    if (!name || !mobile || !village) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    // Check existing mobile
    const existingAdmin = await Admin.findOne({
      mobile,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this mobile number",
      });
    }

    const uploadedImage = await uploadToCloudinary(req.file.buffer);

    const admin = await Admin.create({
      name,
      mobile,
      village,
      profileImage: uploadedImage.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create admin",
    });
  }
};

// ======================================================
// GET ALL ADMINS
// ======================================================

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
    });
  }
};

// ======================================================
// GET ADMIN BY ID
// ======================================================

export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin",
    });
  }
};

// ======================================================
// UPDATE ADMIN
// ======================================================

export const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update admin",
    });
  }
};

// ======================================================
// DELETE ADMIN
// ======================================================

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete admin",
    });
  }
};
