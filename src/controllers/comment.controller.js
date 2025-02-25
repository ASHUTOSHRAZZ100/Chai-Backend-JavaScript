import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comments.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if(!isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid video id");
  }
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const { comment } = req.body;
  if(!comment){
    throw new ApiError(400, "Comment is required");
  }
  
  const newComment = new Comment({
    video: videoId,
    content: comment,
    user: req.user._id,
  });
  const savedComment = await newComment.save();
  res.status(201).json(new ApiResponse(201, { comment: savedComment }));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const { comment } = req.body;
  const updatedComment = await Comment.findByIdAndUpdate(
    { _id: commentId },
    { $set: { content: comment } },
    { new: true }
  );
  if (!updatedComment) {
    throw new ApiError(404, "Comment not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { comment: updatedComment }));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { message: "Comment deleted successfully" }));
});

export { getVideoComments, updateComment, addComment, deleteComment };
