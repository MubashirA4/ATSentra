import {
  matchCandidateResumeToJob,
} from "../../services/candidates/candidateJobMatchService.js";

export const candidateJobMatchController = async (
  req,
  res,
) => {
  try {
    const {
      resumeId,
      jobDescription,
    } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    if (
      !jobDescription ||
      typeof jobDescription !== "string" ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    const result =
      await matchCandidateResumeToJob({
        resumeId,
        userId: req.user.userId,
        jobDescription,
      });

    return res.status(200).json({
      success: true,
      message:
        "Candidate job match completed successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};