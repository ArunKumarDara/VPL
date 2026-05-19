// utils/cloudinaryUpload.js

import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// ======================================================
// UPLOAD IMAGE TO CLOUDINARY
// ======================================================

export const uploadToCloudinary = async (
  fileBuffer,
  folder = "vpl-players",
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },

      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
