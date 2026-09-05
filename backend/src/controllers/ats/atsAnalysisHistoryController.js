import {
  getATSAnalysisHistory,
  getATSAnalysisHistoryDetails,
} from "../../services/ats/getATSAnalysisHistoryService.js";

export const getATSAnalysisHistoryController = async (req, res) => {
  const runs = await getATSAnalysisHistory({
    createdBy: req.user.userId,
  });

  return res.status(200).json({
    success: true,
    message: "ATS analysis history fetched successfully",
    data: {
      runs,
    },
  });
};

export const getATSAnalysisHistoryDetailsController = async (req, res) => {
  const { runId } = req.params;

  const result = await getATSAnalysisHistoryDetails({
    runId,
    createdBy: req.user.userId,
  });

  return res.status(200).json({
    success: true,
    message: "ATS analysis details fetched successfully",
    data: {
      analysisRun: result.analysisRun,

      job: result.job,

      candidates: result.analyses.map((analysis) => ({
        candidateId: String(analysis.candidateId?._id ?? analysis.candidateId),

        candidate: analysis.candidate
          ? {
              _id: String(analysis.candidate._id),
              name: analysis.candidate.name,
              email: analysis.candidate.email ?? null,
              location: analysis.candidate.location ?? null,
            }
          : null,

        rank: analysis.rank,

        rankingScore: analysis.rankingScore,

        eligible: analysis.eligible,

        eligibilityReasons: analysis.eligibilityReasons,

        matchResult: analysis.matchResult,

        explanation: analysis.explanation,

        rankingComparison: analysis.rankingComparison,

        analysisId: String(analysis._id),
      })),
    },
  });
};
