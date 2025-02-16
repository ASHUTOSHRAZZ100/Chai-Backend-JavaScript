import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  isValidEmail,
  isValidPasswordLength,
  isValidUsername,
} from "../utils/ValidateCheck.js";

const genrateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.genrateAccessToken();
    const refreshToken = user.genrateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating referesh and access token"
    );
  }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  // get user detail from frotend
  const { fullname, username, email, password } = req.body;

  // validation of user detail
  if (fullname === "") {
    throw new ApiError(400, "Fullname is required");
  }
  if (username === "") {
    throw new ApiError(400, "Username is required");
  }
  if (email === "") {
    throw new ApiError(400, "Email is required");
  }
  if (password === "") {
    throw new ApiError(400, "Password is required");
  }

  // check for username validation
  if (!isValidUsername(username)) {
    throw new ApiError(400, "Invalid username");
  }

  // check for email validation
  if (!isValidEmail(email)) {
    throw new ApiError(400, "Invalid email");
  }

  // check for password length
  if (!isValidPasswordLength(password)) {
    throw new ApiError(400, "Password must be between 8 and 20 characters");
  }

  // check if user already exist
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  // check for image, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath = null;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar files is required");
  }

  // upload image to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }
  // create user object - create entry in db
  const newUser = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  // remove password and refresh token  fied from response
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  // return res
  return res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", createdUser));
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  const { email, username, password } = req.body;

  // check username or email match
  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  // find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // password check
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // access and referesh token
  const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookie
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          users: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully"
      )
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { rerefreshToken: undefined },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user Logged Out"));
});

export { registerUser, loginUser, logoutUser };
