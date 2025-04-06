import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlists.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "name and description are required");
  }
  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });
  if (!playlist) {
    throw new ApiError(500, "Playlist not created");
  }
  res.status(201).json(new ApiResponse(201, playlist));
});
const getUserPlaylist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
});
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
});
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (
    !playlistId ||
    !videoId ||
    isValidObjectId(playlistId) ||
    isValidObjectId(videoId)
  ) {
    throw new ApiError(
      400,
      "playlistId and videoId are required and must be valid"
    );
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already in playlist");
  }
  playlist.videos.push(videoId);
  await playlist.save();

  res.status(200).json(new ApiResponse(200, playlist));
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (
    !playlistId ||
    !videoId ||
    isValidObjectId(playlistId) ||
    isValidObjectId(videoId)
  ) {
    throw new ApiError(
      400,
      "playlistId and videoId are required and must be valid"
    );
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not in playlist");
  }
  playlist.videos = playlist.videos.filter((v) => v !== videoId);
  await playlist.save();
  return res.status(200).json(new ApiResponse(200, playlist));
});
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlistId is required and must be valid");
  }
  const playlist = await Playlist.findByIdAndDelete(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  res.status(200).json(new ApiResponse(200, playlist));
});
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlistId is required and must be valid");
  }
  if (!name && !description) {
    throw new ApiError(400, "name or description is required");
  }
  const updateData = {};
  if (req.body.name) updateData.name = req.body.name;
  if (req.body.description) updateData.description = req.body.description;
  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: updateData,
    },
    { new: true }
  );
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  res.status(200).json(new ApiResponse(200, playlist));
});

export {
  createPlaylist,
  getUserPlaylist,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
