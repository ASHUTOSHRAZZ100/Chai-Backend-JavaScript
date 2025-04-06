import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Likes } from "../models/likes.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getChannelStats = asyncHandler(async (req, res) => {});
const getChannelVideos = asyncHandler(async (req, res) => {});

export { 
    getChannelStats,
    getChannelVideos 
    };
