import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validateStrictEmail } from "../utils/EmailValidate.js";

export const registerUser = asyncHandler(async (req, res, next) => {
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

  // check for email validation
  if (!validateStrictEmail(email)) {
    throw new ApiError(400, "Invalid email");
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
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
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
