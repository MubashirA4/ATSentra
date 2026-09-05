import {
  getCandidateATSHistory,
} from "../../services/ats/atsCandidateHistoryService.js";

export const getCandidateATSHistoryController = async (
  req,
  res,
) => {
  try {
    const { candidateId } = req.params;

    const analyses = await getCandidateATSHistory({
      candidateId,
      createdBy: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Candidate ATS history retrieved successfully",
      data: {
        analyses,
        count: analyses.length,
      },
    });
  } catch (error) {
    console.error(
      "Get candidate ATS history error:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};