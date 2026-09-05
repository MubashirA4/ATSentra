import {
  getATSDecisionByJob,
  getATSAnalysisByCandidate,
  getATSAnalysisByJobAndCandidate,
} from "../../services/ats/retrieveATSDecisionService.js";

export const getATSResultsByJob =
  async (req, res) => {
    try {
      const {
        jobId,
      } = req.params;

      const analyses =
        await getATSDecisionByJob(
          jobId,
        );

      return res.status(200).json({
        success: true,

        message:
          "ATS results retrieved successfully",

        data: {
          jobId,
          count: analyses.length,
          candidates: analyses,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const getATSResultsByCandidate =
  async (req, res) => {
    try {
      const {
        candidateId,
      } = req.params;

      const analyses =
        await getATSAnalysisByCandidate(
          candidateId,
        );

      return res.status(200).json({
        success: true,

        message:
          "Candidate ATS analyses retrieved successfully",

        data: {
          candidateId,
          count: analyses.length,
          analyses,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const getATSResultByJobAndCandidate =
  async (req, res) => {
    try {
      const {
        jobId,
        candidateId,
      } = req.params;

      const analysis =
        await getATSAnalysisByJobAndCandidate({
          jobId,
          candidateId,
        });

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message:
            "ATS analysis not found",
        });
      }

      return res.status(200).json({
        success: true,

        message:
          "ATS analysis retrieved successfully",

        data: {
          analysis,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };