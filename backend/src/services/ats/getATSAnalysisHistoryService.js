import ATSAnalysisRun from "../../models/ATSAnalysisRun.js";
import ATSAnalysis from "../../models/ATSAnalysis.js";

export const getATSAnalysisHistory =
  async ({ createdBy }) => {
    if (!createdBy) {
      throw new Error(
        "Authenticated user is required",
      );
    }

    return ATSAnalysisRun.find({
      createdBy,
    })
      .populate(
        "jobId",
        "title company location status",
      )
      .sort({
        createdAt: -1,
      })
      .lean();
  };

export const getATSAnalysisHistoryDetails =
  async ({
    runId,
    createdBy,
  }) => {
    const analysisRun =
      await ATSAnalysisRun.findOne({
        _id: runId,
        createdBy,
      })
        .populate(
          "jobId",
          "title company location employmentType requiredSkills preferredSkills experienceRequirement educationRequirements responsibilities description status",
        )
        .lean();

    if (!analysisRun) {
      throw new Error(
        "ATS analysis run not found",
      );
    }

    const analyses =
      await ATSAnalysis.find({
        analysisRunId: analysisRun._id,
        jobId: analysisRun.jobId._id,
      })
        .populate(
          "candidateId",
        )
        .sort({
          rank: 1,
        })
        .lean();

    return {
      analysisRun,
      job: analysisRun.jobId,
      analyses,
    };
  };