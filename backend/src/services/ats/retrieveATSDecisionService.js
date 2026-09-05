import ATSAnalysis from "../../models/ATSAnalysis.js";
import { validateMongoId } from "../../utils/ats/validateATSIds.js";

export const getATSDecisionByJob = async (jobId) => {
  validateMongoId(jobId, "Job ID");

  return ATSAnalysis.find({
    jobId,
  })
    .sort({
      rank: 1,
    })
    .lean();
};

export const getATSAnalysisByCandidate = async (candidateId) => {
  validateMongoId(candidateId, "Candidate ID");

  return ATSAnalysis.find({
    candidateId,
  })
    .sort({
      createdAt: -1,
    })
    .lean();
};

export const getATSAnalysisByJobAndCandidate = async ({
  jobId,
  candidateId,
}) => {
  validateMongoId(jobId, "Job ID");

  validateMongoId(candidateId, "Candidate ID");

  return ATSAnalysis.findOne({
    jobId,
    candidateId,
  }).lean();
};
