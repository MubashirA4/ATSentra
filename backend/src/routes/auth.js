import express from "express";
import { getMe, login, logout, refresh, register } from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { loginSchema, registerSchema } from "../validators/auth.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/register",validate(registerSchema), asyncHandler(register));
router.post("/login",validate(loginSchema) , asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));
router.get("/me", authenticate, asyncHandler(getMe));

export default router;
