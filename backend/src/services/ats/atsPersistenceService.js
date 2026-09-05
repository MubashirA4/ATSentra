import Job from "../../models/Job.js";
import Candidate from "../../models/Candidate.js";
import ATSAnalysis from "../../models/ATSAnalysis.js";

export const createJob = async (jobData) => {
  if (!jobData || typeof jobData !== "object") {
    throw new Error("Job data is required");
  }

  return Job.create(jobData);
};

export const findJobById = async (jobId) => {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  return Job.findById(jobId);
};

export const createCandidate = async (
  candidateData,
) => {
  if (
    !candidateData ||
    typeof candidateData !== "object"
  ) {
    throw new Error(
      "Candidate data is required",
    );
  }

  return Candidate.create(candidateData);
};

export const findCandidateById = async (
  candidateId,
) => {
  if (!candidateId) {
    throw new Error(
      "Candidate ID is required",
    );
  }

  return Candidate.findById(candidateId);
};

export const createATSAnalysis = async (
  analysisData,
) => {
  if (
    !analysisData ||
    typeof analysisData !== "object"
  ) {
    throw new Error(
      "ATS analysis data is required",
    );
  }

  return ATSAnalysis.create(
    analysisData,
  );
};

export const findATSAnalysisById =
  async (analysisId) => {
    if (!analysisId) {
      throw new Error(
        "ATS analysis ID is required",
      );
    }

    return ATSAnalysis.findById(
      analysisId,
    );
  };

export const findATSAnalysesByJob =
  async (jobId) => {
    if (!jobId) {
      throw new Error(
        "Job ID is required",
      );
    }

    return ATSAnalysis.find({
      jobId,
    }).sort({
      rank: 1,
    });
  };

export const findATSAnalysesByCandidate =
  async (candidateId) => {
    if (!candidateId) {
      throw new Error(
        "Candidate ID is required",
      );
    }

    return ATSAnalysis.find({
      candidateId,
    }).sort({
      createdAt: -1,
    });
  };