import mongoose, { isValidObjectId } from "mongoose";
import { Likes } from "../models/likes.models.js";
import { Comment } from "../models/comments.models.js";
import { Video } from "../models/video.models.js";
import { Tweet } from "../models/tweets.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  let like = await Likes.findOne({ video: videoId, likeBy: req.user._id });

  if (like) {
    await Likes.deleteOne(like._id);
    return res.status(200).json(new ApiResponse(200, "Video unliked"));
  }

  like = await Likes.create({
    video: videoId,
    likeBy: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, "Video liked"));
});
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment id");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  let like = await Likes.findOne({ comment: commentId, likeBy: req.user._id });

  if (like) {
    await Likes.deleteOne(like._id);
    return res.status(200).json(new ApiResponse(200, "Comment unliked"));
  }

  like = await Likes.create({
    comment: commentId,
    likeBy: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, "Comment liked"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet id");
  }
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  let like = await Likes.findOne({ tweet: tweetId, likeBy: req.user._id });

  if (like) {
    await Likes.deleteOne(like._id);
    return res.status(200).json(new ApiResponse(200, "Tweet unliked"));
  }

  like = await Likes.create({
    tweet: tweetId,
    likeBy: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, "Tweet liked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {});

export { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike };
