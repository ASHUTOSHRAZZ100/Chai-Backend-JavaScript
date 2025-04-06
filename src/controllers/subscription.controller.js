import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});
const getuserChannelSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});
const getSubscriptionChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export {
  toggleSubscription,
  getSubscriptionChannels,
  getuserChannelSubscription,
};
