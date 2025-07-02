import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somethin went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // res.status(201).json({ message: "Everything is okay" })

  // get user details ✅
  // validate data ✅
  // check if user is already exist or not? email, useername ✅
  // check for image and coverImage ✅
  // upload them to cloudinary ✅
  // craete user object ✅
  // remove password, refresh token
  // check user creation
  // return res

  const { username, fullName, email, password } = req.body; // req.body = destructure and to take value from user
  console.log(username);

  // if(username === "") {
  //     throw new ApiError(400, "username is required")
  // }

  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      400,
      "User with this email or username is already exist"
    );
  }

  // console.log("req.files: ", req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required!!!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required!!!");
  }

  const user = await User.create({
    username,
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || null,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong, while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully!!!"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data ✅
  // username or email validate ✅
  // find the user ✅
  // password ✅
  // access and refresh token ✅
  //  send cookie

  const { email, username, password } = req.body;
  console.log("email: ", email);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isPasswordVaild = await user.isPasswordCorrect(password);

  if (!isPasswordVaild) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: undefined || 1,
      },
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
    .status(201)
    .clearCookie("acce", options)
    .clearCookie("refershToken", options)
    .json(new ApiResponse(200, {}, "User loggedOu out!!"));
});

export { registerUser, loginUser, logoutUser };
