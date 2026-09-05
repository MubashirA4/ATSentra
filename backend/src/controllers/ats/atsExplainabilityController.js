import {
  getATSAnalysisExplanation,
  compareATSAnalyses,
  buildComparisonSummary,
} from "../../services/ats/atsExplainabilityService.js";

export const getATSAnalysisExplanationController =
  async (
    req,
    res,
  ) => {
    const result =
      await getATSAnalysisExplanation(
        req.params.analysisId,
      );

    return res.status(200).json({
      success: true,

      message:
        "ATS explanation retrieved successfully",

      data: result,
    });
  };

export const compareATSAnalysesController =
  async (
    req,
    res,
  ) => {
    const comparison =
      await compareATSAnalyses({
        jobId:
          req.params.jobId,

        candidateA:
          req.params.candidateA,

        candidateB:
          req.params.candidateB,
      });

    const summary =
      buildComparisonSummary(
        comparison,
      );

    return res.status(200).json({
      success: true,

      message:
        "ATS candidate comparison completed successfully",

      data: {
        ...comparison,

        summary,
      },
    });
  };