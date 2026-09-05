import express from "express";

import {
  createCandidateController,
  getCandidatesController,
  getCandidateByIdController,
  updateCandidateController,
  deleteCandidateController,
} from "../../controllers/candidates/candidateController.js";

import { candidateJobMatchController } from "../../controllers/candidates/candidateJobMatchController.js";

import { candidateJobMatchHistoryController } from "../../controllers/candidates/candidateJobMatchHistoryController.js";
import { candidateJobMatchDetailController } from "../../controllers/candidates/candidateJobMatchDetailController.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createCandidateController);

router.post("/job-match", candidateJobMatchController);

router.get("/job-match/history", candidateJobMatchHistoryController);
router.get("/job-match/:matchId", candidateJobMatchDetailController);

router.get("/", getCandidatesController);

router.get("/:candidateId", getCandidateByIdController);

router.patch("/:candidateId", updateCandidateController);

router.delete("/:candidateId", deleteCandidateController);

export default router;
