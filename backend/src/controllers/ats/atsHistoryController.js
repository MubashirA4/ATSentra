import {
  getATSAnalysisHistory,
} from "../../services/ats/atsHistoryService.js";

export const getATSAnalysisHistoryController =
  async (req, res) => {
    const result =
      await getATSAnalysisHistory({
        jobId:
          req.params.jobId,

        query:
          req.query,
      });

    return res.status(200).json({
      success: true,

      message:
        "ATS analysis history retrieved successfully",

      data: result,
    });
  };