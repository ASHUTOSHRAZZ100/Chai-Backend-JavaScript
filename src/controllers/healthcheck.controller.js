import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthcheck = asyncHandler(async (req, res) => {});

export { healthcheck };
