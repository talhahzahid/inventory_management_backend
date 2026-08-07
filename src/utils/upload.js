import fs from "fs";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";
dotenv.config();

// export const uploadImageToCloudinary = async (file) => {
//   try {
//     const result = await cloudinary.uploader.upload(file, {
//       folder: "companies_logo",
//     });
//     fs.unlink(file, (err) => {
//       if (err) console.error("Failed to delete local file:", err.message);
//     });
//     return result;
//   } catch (error) {
//     fs.unlink(file, (err) => {
//       if (err) console.error("Failed to delete local file:", err.message);
//     });
//     console.log("Cloudinary upload error", error.message);
//     throw error;
//   }
// };

// import cloudinary from "../config/cloudinary.js"; // sahi path daalein

export const uploadImageToCloudinary = (fileBuffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(fileBuffer);
  });
};
