import { compareCandidatesForExplanation } from "./rankingComparison.js";
import { calculateRankingScore } from "./rankingScore.js";
import { evaluateCandidateEligibility } from "./candidateEligibility.js";
import { DEFAULT_RANKING_CONFIG } from "./rankingConfig.js";
import { validateRankingConfig } from "./validateRankingConfig.js";
import { generateRankingExplanation } from "./rankingExplanation.js";

const safeScore = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, number));
};

const compareCandidates = (a, b) => {
  // Eligible candidates first
  if (a.eligible !== b.eligible) {
    return a.eligible ? -1 : 1;
  }

  // Overall ranking score
  if (b.rankingScore !== a.rankingScore) {
    return b.rankingScore - a.rankingScore;
  }

  // Required skills
  const requiredA = safeScore(a.matchResult?.skills?.requiredMatchPercentage);

  const requiredB = safeScore(b.matchResult?.skills?.requiredMatchPercentage);

  if (requiredB !== requiredA) {
    return requiredB - requiredA;
  }

  // Experience
  const experienceA = safeScore(a.matchResult?.experience?.score);

  const experienceB = safeScore(b.matchResult?.experience?.score);

  if (experienceB !== experienceA) {
    return experienceB - experienceA;
  }

  // Preferred skills
  const preferredA = safeScore(a.matchResult?.skills?.preferredMatchPercentage);

  const preferredB = safeScore(b.matchResult?.skills?.preferredMatchPercentage);

  if (preferredB !== preferredA) {
    return preferredB - preferredA;
  }

  // Deterministic fallback
  return String(a.candidateId ?? "").localeCompare(String(b.candidateId ?? ""));
};

export const rankCandidates = (candidates = [], config = {}) => {
  if (!Array.isArray(candidates)) {
    throw new TypeError(
      "Invalid candidates input: candidates must be an array",
    );
  }

  const rankingConfig = {
    ...DEFAULT_RANKING_CONFIG,
    ...config,
  };

  const configValidation = validateRankingConfig(rankingConfig);

  if (!configValidation.valid) {
    throw new Error(
      `Invalid ranking configuration: ${configValidation.errors.join("; ")}`,
    );
  }

  const rankedCandidates = candidates
    .map((candidate) => {
      const safeCandidate = candidate ?? {};

      const eligibility = evaluateCandidateEligibility({
        matchResult: safeCandidate.matchResult,
        config: rankingConfig,
      });

      const rankingScore = calculateRankingScore({
        matchScore: safeCandidate.matchResult?.score,
      });

      const explanation = generateRankingExplanation({
        matchResult: safeCandidate.matchResult,
        eligible: eligibility.eligible,
        eligibilityReasons: eligibility.reasons,
      });

      return {
        ...safeCandidate,

        eligible: eligibility.eligible,

        eligibilityReasons: eligibility.reasons,

        rankingScore,

        explanation,
      };
    })
    .sort(compareCandidates);

  const ranked = rankedCandidates.map((candidate, index) => ({
    ...candidate,
    rank: index + 1,
  }));

  const rankedWithComparisons = ranked.map((candidate, index) => {
    if (index === 0) {
      return {
        ...candidate,

        rankingComparison: {
          factor: "topCandidate",

          summary:
            "Top-ranked candidate based on the configured eligibility and ranking criteria.",

          metrics: null,

          details: [],
        },
      };
    }

    const previousCandidate = ranked[index - 1];

    const comparison = compareCandidatesForExplanation(
      previousCandidate,
      candidate,
    );

    return {
      ...candidate,

      rankingComparison: comparison,
    };
  });

  if (rankingConfig.topCandidates) {
    return rankedWithComparisons.slice(0, rankingConfig.topCandidates);
  }

  return rankedWithComparisons;
};
