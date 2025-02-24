import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "videoTube",
    });

    // File has been uploaded successfull
    // console.log('file is uploaded an cloudinary',response.url);
    fs.unlinkSync(localFilePath); // remove the saved the temporary file as the upload operation got success
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the saved the temporary file as the upload operation got failed
    return null;
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("publicId is required to delete a file from Cloudinary.");
    }

    const response = await cloudinary.uploader.destroy(publicId, {
    folder: "videoTube",
      resource_type: "auto",
      invalidate: true,
    });

    if (response.result !== "ok") {
      console.warn("Failed to delete file from Cloudinary:", response);
      return null;
    }

    console.log("File deleted from Cloudinary:", response);
    return response;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
