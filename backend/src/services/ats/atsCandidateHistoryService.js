import mongoose from "mongoose";
import ATSAnalysis from "../../models/ATSAnalysis.js";
import ATSAnalysisRun from "../../models/ATSAnalysisRun.js";

const validateId = (id, label) => {
  if (!id) {
    throw new Error(`${label} is required`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${label}`);
  }
};

export const getCandidateATSHistory = async ({
  candidateId,
  createdBy,
}) => {
  validateId(candidateId, "Candidate ID");
  validateId(createdBy, "User ID");

  // 1. Find analysis runs owned by the logged-in HR
  const runs = await ATSAnalysisRun.find({
    createdBy,
  })
    .select("_id")
    .lean();

  const runIds = runs.map((run) => run._id);

  // No analysis runs for this HR
  if (runIds.length === 0) {
    return [];
  }

  // 2. Find this candidate's analyses inside those runs
  const analyses = await ATSAnalysis.find({
    candidateId,
    analysisRunId: {
      $in: runIds,
    },
  })
    .populate({
      path: "jobId",
      select: "title company location status",
    })
    .sort({ createdAt: -1 })
    .lean();

  return analyses.map((analysis) => ({
    _id: analysis._id,

    analysisRunId:
      analysis.analysisRunId ?? null,

    job: analysis.jobId
      ? {
          _id: analysis.jobId._id,
          title: analysis.jobId.title,
          company: analysis.jobId.company,
          location:
            analysis.jobId.location ?? null,
          status:
            analysis.jobId.status ?? null,
        }
      : null,

    rankingScore:
      analysis.rankingScore ?? 0,

    rank:
      analysis.rank ?? null,

    eligible:
      analysis.eligible ?? false,

    eligibilityReasons:
      analysis.eligibilityReasons ?? [],

    matchResult:
      analysis.matchResult ?? null,

    createdAt:
      analysis.createdAt,

    updatedAt:
      analysis.updatedAt,
  }));
};