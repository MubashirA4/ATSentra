import ATSAnalysis from "../../models/ATSAnalysis.js";
import ATSAnalysisRun from "../../models/ATSAnalysisRun.js";

export const saveATSDecision = async ({
  jobId,
  candidateIds,
  candidates,
  createdBy,
}) => {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  if (!createdBy) {
    throw new Error("Analysis creator is required");
  }

  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error("Candidates are required");
  }

  if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
    throw new Error("Candidate IDs are required");
  }

  const analysisRun = await ATSAnalysisRun.create({
    jobId,
    createdBy,
    candidateCount: candidateIds.length,
    status: "running",
  });

  try {
 const operations = candidates.map((candidate) => ({
  insertOne: {
    document: {
      analysisRunId: analysisRun._id,

      jobId,

      candidateId: candidate.candidateId,

      candidate: candidate.candidate
        ? {
            _id: candidate.candidate._id,
            name: candidate.candidate.name,
            email: candidate.candidate.email ?? null,
            location: candidate.candidate.location ?? null,
          }
        : null,

      matchResult: candidate.matchResult,

      rankingScore: candidate.rankingScore,

      eligible: candidate.eligible,

      eligibilityReasons:
        candidate.eligibilityReasons ?? [],

      explanation:
        candidate.explanation ?? null,

      rank:
        candidate.rank ?? null,

      rankingComparison:
        candidate.rankingComparison ?? null,

      status:
        candidate.status ?? "completed",
    },
  },
}));

    await ATSAnalysis.bulkWrite(operations);

    const analyses = await ATSAnalysis.find({
      analysisRunId: analysisRun._id,
    })
      .sort({ rank: 1 })
      .lean();

    await ATSAnalysisRun.findByIdAndUpdate(
      analysisRun._id,
      {
        $set: {
          status: "completed",
          completedAt: new Date(),
        },
      },
    );

    return {
      analysisRun: {
        ...analysisRun.toObject(),
        status: "completed",
        completedAt: new Date(),
      },
      analyses,
    };
  } catch (error) {
    await ATSAnalysisRun.findByIdAndUpdate(
      analysisRun._id,
      {
        $set: {
          status: "failed",
          errorMessage: error.message,
        },
      },
    );

    throw error;
  }
};