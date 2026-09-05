import User from "../models/User.js";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../services/auth.js";
import AppError from "../utils/AppError.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const result = await registerUser({
    name,
    email,
    password,
    role,
  });

  res
    .status(201)
    .cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await loginUser({
    email,
    password,
  });

  res
    .status(200)
    .cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const result = await refreshAccessToken(refreshToken);

  res
    .status(200)
    .cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await logoutUser(refreshToken);

  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .status(200)
    .json({
      success: true,
      message: "Logout successful",
    });
};
