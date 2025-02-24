import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// check file type is image or not
const IsImage = (filepath) => {
  const imageExtensions = ["jpg", "png", "gif", "webp", "svg", "jpeg"];
  return imageExtensions.some((ext) => filepath?.endsWith(ext));
};

// check file type is video or not
const Isvideo = (filepath) => {
  const videoExtensions = [
    "mp4",
    "mov",
    "avi",
    "wmv",
    "flv",
    "mkv",
    "webm",
    "ts",
    "3gp",
    "ogv",
    "m4v",
    "mpg",
    "mpeg",
    "rm",
    "rmvb",
    "asf",
  ];
  return videoExtensions.some((ext) => filepath?.endsWith(ext));
};

// Get all videos
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
});

// Publish video
const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title && !description) {
    throw new ApiError(400, "Title and description not provided");
  }

  // check video file and thumbnail file is provided or not
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!videoLocalPath && !thumbnailLocalPath) {
    throw new ApiError(400, "Video file and thumbnail not provided");
  }

  if (!Isvideo(req.files?.videoFile[0]?.mimetype)) {
    throw new ApiError(
      400,
      "Invalid file type please upload video file with extension mp4, mov, avi, wmv, flv, mkv, webm, ts, 3gp, ogv, m4v, mpg, mpeg, rm, rmvb, asf"
    );
  }

  if (!IsImage(req.files?.thumbnail[0]?.mimetype)) {
    throw new ApiError(
      400,
      "Invalid file type please upload image file with extension jpg, png, gif, webp, svg"
    );
  }

  const videoUplaoad = await uploadOnCloudinary(videoLocalPath);

  const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

  // create video in DB
  const video = await Video.create({
    videoFile: videoUplaoad.url,
    thumbnail: thumbnailUpload.url,
    description,
    title: title,
    videoPublicId: videoUplaoad.public_id,
    thumbnailPublicId: thumbnailUpload.public_id,
    duration: videoUplaoad.duration,
    owner: req.user._id,
  });
  return res.status(201).json(new ApiResponse(201, { video }));
});

// Get video by id
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  const video = await Video.findById(videoId).populate({
    path: "owner",
    model: User,
    select: "fullname",
  });
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  res.status(200).json(new ApiResponse(200, { video }));
});

// Update video thumbnail
const updateVideoThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if(!isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid video ID");
  }
  let video = await Video.findById(videoId);

  if(!video){
    throw new ApiError(404, "Video not found");
  }

  // get thumbnail path from req.file and check is valid  or not
  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail not provided");
  }

  // check file type is image or not
  if (!IsImage(req.file?.mimetype)) {
    throw new ApiError(
      400,
      "Invalid file type please upload image file with extension jpg, png, gif, webp, svg"
    );
  }

  // upload thumbnail on cloudinary
  const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath);
  const deletedThumbnail = await deleteFromCloudinary(video.thumbnailPublicId);

  video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        thumbnail: thumbnailUrl.url,
      },
    },
    { new: true }
  );
  return res.status(200).json(new ApiResponse(200, { video }));
});

// Delete video thumbnail
const deleteVideoThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Delete thumbnail from Cloudinary and update DB simultaneously
  const [deletedThumbnail, updatedVideo] = await Promise.all([
    deleteFromCloudinary(video.thumbnailPublicId),
    Video.findByIdAndUpdate(
      videoId,
      { $set: { thumbnail: process.env.DEFAULT_VIDEO_THUMBNAIL } },
      { new: true }
    ),
  ]);

  console.log("Deleted Thumbnail:", deletedThumbnail);

  return res.status(200).json(new ApiResponse(200, { video: updatedVideo }));
});

// Delete video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const [deletedThumbnail, deletedVideo, videoDeletedFromDB] =
    await Promise.all([
      deleteFromCloudinary(video.thumbnailPublicId),
      deleteFromCloudinary(video.videoPublicId),
      Video.findByIdAndDelete(videoId),
    ]);
  res.status(200).json(new ApiResponse(200, { message:"video deleted successfully" }));
});

// Toogle publish status
const tooglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if(!isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid video ID");
  }
  const video = await Video.findByIdAndUpdate(videoId, {
    $set: {
      isPublished: !video.isPublished,
    },
  });
  if(!video){
    throw new ApiError(404, "Video not found");
  }
  return res.status(200).json(new ApiResponse(200, { video }));
});

export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideoThumbnail,
  deleteVideo,
  tooglePublishStatus,
  deleteVideoThumbnail
};
