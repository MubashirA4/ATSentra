import {
  getATSJobAnalytics,
} from "../../services/ats/atsAnalyticsService.js";

export const getATSJobAnalyticsController =
  async (req, res) => {
    const result =
      await getATSJobAnalytics({
        jobId:
          req.params.jobId,

        query:
          req.query,
      });

    return res.status(200).json({
      success: true,

      message:
        "ATS analytics retrieved successfully",

      data: result,
    });
  };