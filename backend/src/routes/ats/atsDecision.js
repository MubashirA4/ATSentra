import express from "express";
import { createATSDecision } from "../../controllers/ats/atsDecision.js";
import { executeATSController } from "../../controllers/ats/executeATSController.js";
import { authenticate } from "../../middleware/auth.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = express.Router();

router.post("/decision", createATSDecision);
router.post("/execute", authenticate, asyncHandler(executeATSController));

export default router;
