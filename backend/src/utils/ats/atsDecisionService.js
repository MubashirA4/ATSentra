import { validateATSDecisionRequest } from "./validateATSDecisionRequest.js";
import { matchResumeToJob } from "../matching/matchResumeToJob.js";
import { rankCandidates } from "../ranking/candidateRanker.js";
import { saveATSDecision } from "../../services/ats/saveATSDecisionService.js";

export const makeATSDecision = async (input) => {
  validateATSDecisionRequest(input);

  const {
    job,
    candidates,
    jobId,
  } = input;

  const candidatesWithMatches =
    candidates.map((candidate) => {
      const matchResult =
        matchResumeToJob({
          resume: candidate.resume,
          job,
        });

      return {
        candidateId:
          candidate.candidateId,

        matchResult,
      };
    });

  const rankedCandidates =
    rankCandidates(
      candidatesWithMatches,
    );

  let persistedAnalyses = [];

  if (jobId) {
    persistedAnalyses =
      await saveATSDecision({
        jobId,
        candidates:
          rankedCandidates,
      });
  }

  return {
    job,
    candidates:
      rankedCandidates,
    persistedAnalyses,
  };
};