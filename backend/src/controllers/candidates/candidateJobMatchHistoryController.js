import {
  getCandidateJobMatchHistory,
} from "../../services/candidates/candidateJobMatchHistoryService.js";

export const candidateJobMatchHistoryController =
  async (req, res) => {
    try {
      const {
        page,
        limit,
      } = req.query;

      const result =
        await getCandidateJobMatchHistory({
          userId: req.user.userId,
          page,
          limit,
        });

      return res.status(200).json({
        success: true,
        message:
          "Candidate job match history retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error(
        "Candidate job match history error:",
        error,
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to retrieve candidate job match history",
      });
    }
  };