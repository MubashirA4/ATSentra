import {
  getCandidateJobMatchDetail,
} from "../../services/candidates/candidateJobMatchDetailService.js";

export const candidateJobMatchDetailController =
  async (req, res) => {
    try {
      const { matchId } = req.params;

      const result =
        await getCandidateJobMatchDetail({
          matchId,
          userId: req.user.userId,
        });

      return res.status(200).json({
        success: true,
        message:
          "Candidate job match detail retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error(
        "Candidate job match detail error:",
        error,
      );

      const statusCode =
        error.message?.includes("not found") ||
        error.message?.includes("permission")
          ? 404
          : 400;

      return res.status(statusCode).json({
        success: false,
        message:
          error.message ||
          "Failed to retrieve candidate job match detail",
      });
    }
  };