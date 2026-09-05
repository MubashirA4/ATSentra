import express from "express";

import {
  authenticate,
  authorizeRoles,
} from "../middleware/auth.js";

import {
  uploadResume as uploadResumeMiddleware,
} from "../middleware/upload.js";

import asyncHandler from "../utils/asyncHandler.js";

import {
  getResume,
  getResumeAnalysis,
  getResumes,
  getRecruiterResumes,
  removeResume,
  uploadResume,
} from "../controllers/resume.js";

import { processResumeController } from "../controllers/processResume.js";

import {
  getRecruiterResumeDetailsController,
  uploadRecruiterResume,
} from "../controllers/resume/recruiterResumeController.js";

const router = express.Router();


// ==============================
// Candidate Resume
// ==============================

router.post(
  "/",
  authenticate,
  uploadResumeMiddleware.single("resume"),
  asyncHandler(uploadResume),
);

router.get(
  "/",
  authenticate,
  asyncHandler(getResumes),
);


// ==============================
// Recruiter Resume Pool
// ==============================

router.post(
  "/recruiter",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  uploadResumeMiddleware.single("resume"),
  asyncHandler(uploadRecruiterResume),
);

router.get(
  "/recruiter",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  asyncHandler(getRecruiterResumes),
);

router.get(
  "/recruiter/:id",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  asyncHandler(getRecruiterResumeDetailsController),
);


// ==============================
// Individual Resume
// ==============================

router.get(
  "/:id",
  authenticate,
  asyncHandler(getResume),
);

router.get(
  "/:id/analysis",
  authenticate,
  asyncHandler(getResumeAnalysis),
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(removeResume),
);


// ==============================
// Resume Processing
// ==============================

router.post(
  "/:id/process",
  authenticate,
  asyncHandler(processResumeController),
);

export default router;