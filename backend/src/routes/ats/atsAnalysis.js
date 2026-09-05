import express from "express";

import {
  getATSResultsByJob,
  getATSResultsByCandidate,
  getATSResultByJobAndCandidate,
} from "../../controllers/ats/getATSDecisionController.js";

import {
  getATSAnalysisHistoryController as getATSJobAnalysisHistoryController,
} from "../../controllers/ats/atsHistoryController.js";

import {
  getATSJobAnalyticsController,
} from "../../controllers/ats/atsAnalyticsController.js";

import {
  getATSAnalysisExplanationController,
  compareATSAnalysesController,
} from "../../controllers/ats/atsExplainabilityController.js";

import {
  getATSDashboardController,
} from "../../controllers/ats/atsDashboardController.js";

import {
  getATSAnalysisHistoryController,
  getATSAnalysisHistoryDetailsController,
} from "../../controllers/ats/atsAnalysisHistoryController.js";

import {
  getCandidateATSHistoryController,
} from "../../controllers/ats/atsCandidateHistoryController.js";

import { authenticate } from "../../middleware/auth.js";

import asyncHandler from "../../utils/asyncHandler.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Job ATS History
|--------------------------------------------------------------------------
*/

router.get(
  "/jobs/:jobId/history",
  authenticate,
  asyncHandler(
    getATSJobAnalysisHistoryController,
  ),
);

/*
|--------------------------------------------------------------------------
| ATS Results
|--------------------------------------------------------------------------
*/

router.get(
  "/jobs/:jobId",
  authenticate,
  asyncHandler(getATSResultsByJob),
);

router.get(
  "/candidates/:candidateId",
  authenticate,
  asyncHandler(getATSResultsByCandidate),
);


router.get(
  "/candidates/:candidateId/history",
  authenticate,
  asyncHandler(getCandidateATSHistoryController),
);

router.get(
  "/jobs/:jobId/candidates/:candidateId",
  authenticate,
  asyncHandler(
    getATSResultByJobAndCandidate,
  ),
);



/*
|--------------------------------------------------------------------------
| ATS Analytics
|--------------------------------------------------------------------------
*/

router.get(
  "/jobs/:jobId/analytics",
  authenticate,
  asyncHandler(
    getATSJobAnalyticsController,
  ),
);

/*
|--------------------------------------------------------------------------
| ATS Explainability
|--------------------------------------------------------------------------
*/

router.get(
  "/analyses/:analysisId/explanation",
  authenticate,
  asyncHandler(
    getATSAnalysisExplanationController,
  ),
);

router.get(
  "/jobs/:jobId/compare/:candidateA/:candidateB",
  authenticate,
  asyncHandler(
    compareATSAnalysesController,
  ),
);

/*
|--------------------------------------------------------------------------
| ATS Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/jobs/:jobId/dashboard",
  authenticate,
  asyncHandler(
    getATSDashboardController,
  ),
);

/*
|--------------------------------------------------------------------------
| ATS Analysis Runs
|--------------------------------------------------------------------------
|
| GET /ats/analysis
|     → all analysis runs belonging to logged-in HR
|
| GET /ats/analysis/:runId
|     → complete saved result for one analysis run
|
|--------------------------------------------------------------------------
*/

router.get(
  "/analysis",
  authenticate,
  asyncHandler(
    getATSAnalysisHistoryController,
  ),
);

router.get(
  "/analysis/:runId",
  authenticate,
  asyncHandler(
    getATSAnalysisHistoryDetailsController,
  ),
);



export default router;