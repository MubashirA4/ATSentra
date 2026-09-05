import { executeATSForJob } from "../../services/ats/executeATSService.js";
import { validateATSExecutionRequest } from "../../utils/ats/validateATSExecutionRequest.js";

export const executeATSController = async (
  req,
  res,
) => {
  validateATSExecutionRequest(req.body);

  const {
    jobId,
    candidateIds,
  } = req.body;

  const result = await executeATSForJob({
    jobId,
    candidateIds,
    createdBy: req.user.userId,
  });

  return res.status(200).json({
    success: true,

    message:
      "ATS analysis completed successfully",

    data: {
      analysisRun: result.analysisRun,

      job: result.job,

      candidates:
        result.candidates.map(
          (candidate) => ({
            candidateId:
              candidate.candidateId,
            name: candidate.name,

            rank:
              candidate.rank,

            rankingScore:
              candidate.rankingScore,

            eligible:
              candidate.eligible,

            eligibilityReasons:
              candidate.eligibilityReasons,

            matchResult:
              candidate.matchResult,

            explanation:
              candidate.explanation,

            rankingComparison:
              candidate.rankingComparison,

            analysisId:
              result.persistedAnalyses.find(
                (analysis) =>
                  String(
                    analysis.candidateId,
                  ) ===
                  String(
                    candidate.candidateId,
                  ),
              )?._id ?? null,
          }),
        ),
    },
  });
};