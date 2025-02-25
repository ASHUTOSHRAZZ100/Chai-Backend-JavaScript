import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweets.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  if (!isValidObjectId(req.user._id)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });
  return res.status(201).json(new ApiResponse(201, tweet, "Tweet created"));
});
const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }
    const user
    = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const tweets = await Tweet.find({ owner: userId });
    return res.status(200).json(new ApiResponse(200, tweets, "User tweets"));
});
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }
  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  let tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { content } },
    { new: true }
  );
  return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated"));
});
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findByIdAndDelete(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  return res.status(200).json(new ApiResponse(200, tweet, "Tweet deleted"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
