import Job from "../../models/Job.js";
import Candidate from "../../models/Candidate.js";
import ResumeContent from "../../models/ResumeContent.js";

import { matchResumeToJob } from "../../utils/matching/matchResumeToJob.js";
import { rankCandidates } from "../../utils/ranking/candidateRanker.js";
import { saveATSDecision } from "./saveATSDecisionService.js";
import { validateMongoId } from "../../utils/ats/validateATSIds.js";

export const executeATSForJob = async ({ jobId, candidateIds, createdBy }) => {
  validateMongoId(jobId, "Job ID");

  if (!createdBy) {
    throw new Error("Authenticated user is required");
  }

  if (!Array.isArray(candidateIds)) {
    throw new Error("Candidate IDs must be an array");
  }

  if (candidateIds.length === 0) {
    throw new Error("At least one candidate is required");
  }

  const job = await Job.findById(jobId).lean();

  if (!job) {
    throw new Error("Job not found");
  }

  const candidates = await Candidate.find({
    _id: { $in: candidateIds },
  }).lean();

  if (candidates.length === 0) {
    throw new Error("No candidates found");
  }

  const foundCandidateIds = new Set(
    candidates.map((candidate) => String(candidate._id)),
  );

  const missingCandidateIds = candidateIds.filter(
    (candidateId) => !foundCandidateIds.has(String(candidateId)),
  );

  if (missingCandidateIds.length > 0) {
    throw new Error(`Candidates not found: ${missingCandidateIds.join(", ")}`);
  }

  const resumeIds = candidates
    .map((candidate) => (candidate.resume ? String(candidate.resume) : null))
    .filter(Boolean);

  if (resumeIds.length !== candidates.length) {
    throw new Error("Every candidate must have a resume");
  }

  const resumeContents = await ResumeContent.find({
    resumeId: { $in: resumeIds },
  }).lean();

  const resumeContentMap = new Map(
    resumeContents.map((content) => [String(content.resumeId), content]),
  );

  const candidatesWithMatches = candidates.map((candidate) => {
    const resumeContent = resumeContentMap.get(String(candidate.resume));

    if (!resumeContent) {
      throw new Error(
        `Resume has not been processed for candidate ${candidate._id}`,
      );
    }

    if (!resumeContent.parsedResume) {
      throw new Error(
        `Parsed resume is missing for candidate ${candidate._id}`,
      );
    }

    const parsedResume =
      typeof resumeContent.parsedResume === "string"
        ? JSON.parse(resumeContent.parsedResume)
        : resumeContent.parsedResume;

    const matchResult = matchResumeToJob({
      resume: parsedResume,
      job,
    });

    return {
      candidateId: candidate._id,
      candidate: {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email ?? null,
        location: candidate.location ?? null,
      },
      matchResult,
    };
  });

  const rankedCandidates = rankCandidates(candidatesWithMatches);

  const persisted = await saveATSDecision({
    jobId,
    candidateIds,
    candidates: rankedCandidates,
    createdBy,
  });

  return {
    job,

    analysisRun: persisted.analysisRun,

    candidates: rankedCandidates,

    persistedAnalyses: persisted.analyses,
  };
};
