import express from "express";

import {
  createJobController,
  getJobsController,
  getJobByIdController,
  updateJobController,
  deleteJobController,
  parseJobDescriptionController
} from "../../controllers/jobs/jobController.js";

import {
  authenticate,
  authorizeRoles,
} from "../../middleware/auth.js"

const router = express.Router();

const recruiterAccess = [
  authenticate,
  authorizeRoles("recruiter", "admin"),
];

router.post(
  "/",
  ...recruiterAccess,
  createJobController,
);

router.get(
  "/",
  ...recruiterAccess,
  getJobsController,
);

router.post(
  "/parse",
  ...recruiterAccess,
  parseJobDescriptionController,
);

router.get(
  "/:jobId",
  ...recruiterAccess,
  getJobByIdController,
);

router.patch(
  "/:jobId",
  ...recruiterAccess,
  updateJobController,
);

router.delete(
  "/:jobId",
  ...recruiterAccess,
  deleteJobController,
);

export default router;