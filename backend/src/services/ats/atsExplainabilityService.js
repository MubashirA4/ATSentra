import mongoose from "mongoose";
import ATSAnalysis from "../../models/ATSAnalysis.js";

import Candidate from "../../models/Candidate.js";

import { validateCandidateComparisonIds } from "../../utils/ats/validateATSComparison.js";
import { validateAnalysisId } from "../../utils/ats/validateATSComparison.js";

export const getATSAnalysisExplanation = async (analysisId) => {
  validateAnalysisId(analysisId);

  const analysis = await ATSAnalysis.findById(analysisId)
    .populate({
      path: "candidateId",
      select: "name email phone location skills experience education",
    })
    .populate({
      path: "jobId",
      select:
        "title company location requiredSkills preferredSkills experienceRequirement educationRequirements",
    })
    .lean();

  if (!analysis) {
    throw new Error("ATS analysis not found");
  }

  const matchResult = analysis.matchResult ?? {};

  const skills = matchResult.skills ?? {};

  const experience = matchResult.experience ?? {};

  const education = matchResult.education ?? {};
  const certifications = matchResult.certifications ?? {};

  const explanation = analysis.explanation ?? {};

  const rankingComparison = analysis.rankingComparison ?? null;

  return {
    analysisId: analysis._id,

    job: analysis.jobId
      ? {
          id: analysis.jobId._id,

          title: analysis.jobId.title,

          company: analysis.jobId.company,

          location: analysis.jobId.location,
        }
      : null,

    candidate: analysis.candidateId
      ? {
          id: analysis.candidateId._id,

          name: analysis.candidateId.name,

          email: analysis.candidateId.email,

          phone: analysis.candidateId.phone,

          location: analysis.candidateId.location,

          skills: analysis.candidateId.skills ?? [],
        }
      : null,

    decision: {
      rank: analysis.rank,

      rankingScore: analysis.rankingScore,

      eligible: analysis.eligible,

      eligibilityReasons: analysis.eligibilityReasons ?? [],
    },

    score: {
      overall: matchResult.score ?? 0,

      maxScore: matchResult.maxScore ?? 100,

      breakdown: matchResult.breakdown ?? {},
    },

    skills: {
      matchedRequiredSkills: skills.matchedRequiredSkills ?? [],

      missingRequiredSkills: skills.missingRequiredSkills ?? [],

      requiredMatchPercentage: skills.requiredMatchPercentage ?? 0,

      matchedPreferredSkills: skills.matchedPreferredSkills ?? [],

      missingPreferredSkills: skills.missingPreferredSkills ?? [],

      preferredMatchPercentage: skills.preferredMatchPercentage ?? 0,
    },

    experience: {
      requiredYears: experience.requiredYears ?? null,

      candidateYears: experience.candidateYears ?? null,

      matched: experience.matched ?? false,

      score: experience.score ?? 0,
    },

    education: {
      matched: education.matched ?? false,

      score: education.score ?? 0,

      matchedRequirements: education.matchedRequirements ?? [],

      missingRequirements: education.missingRequirements ?? [],
    },
    certifications: {
      required: certifications.required ?? 0,

      exactMatches: certifications.exactMatches ?? [],

      partialMatches: certifications.partialMatches ?? [],

      missing: certifications.missing ?? [],

      score: certifications.score ?? 100,

      matchPercentage: certifications.matchPercentage ?? 100,

      details: certifications.details ?? [],
    },

    explanation: {
      summary: explanation.summary ?? "",

      strengths: explanation.strengths ?? [],

      weaknesses: explanation.weaknesses ?? [],

      matchedRequiredSkills: explanation.matchedRequiredSkills ?? [],

      missingRequirements: explanation.missingRequirements ?? [],

      reasons: explanation.reasons ?? [],

      matchedPreferredSkills: explanation.matchedPreferredSkills ?? [],
    },

    rankingComparison,
  };
};

const safeNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
};

const compareNumericFactor = ({
  name,
  candidateA,
  candidateB,
  higherIsBetter = true,
}) => {
  const a = safeNumber(candidateA);

  const b = safeNumber(candidateB);

  let winner = "tie";

  if (a !== b) {
    if (higherIsBetter) {
      winner = a > b ? "candidateA" : "candidateB";
    } else {
      winner = a < b ? "candidateA" : "candidateB";
    }
  }

  return {
    factor: name,
    candidateA: a,
    candidateB: b,
    difference: Math.abs(a - b),
    winner,
  };
};

export const compareATSAnalyses = async ({ jobId, candidateA, candidateB }) => {
  validateCandidateComparisonIds({
    jobId,
    candidateA,
    candidateB,
  });

  const jobObjectId = new mongoose.Types.ObjectId(jobId);

  const [analysisA, analysisB] = await Promise.all([
    ATSAnalysis.findOne({
      jobId: jobObjectId,

      candidateId: candidateA,
    })
      .populate({
        path: "candidateId",
        select: "name email phone location skills experience education",
      })
      .lean(),

    ATSAnalysis.findOne({
      jobId: jobObjectId,

      candidateId: candidateB,
    })
      .populate({
        path: "candidateId",
        select: "name email phone location skills experience education",
      })
      .lean(),
  ]);

  if (!analysisA) {
    throw new Error("ATS analysis not found for first candidate");
  }

  if (!analysisB) {
    throw new Error("ATS analysis not found for second candidate");
  }

  const matchA = analysisA.matchResult ?? {};

  const matchB = analysisB.matchResult ?? {};

  const skillsA = matchA.skills ?? {};

  const skillsB = matchB.skills ?? {};

  const experienceA = matchA.experience ?? {};

  const experienceB = matchB.experience ?? {};

  const educationA = matchA.education ?? {};

  const educationB = matchB.education ?? {};

  const certificationsA = matchA.certifications ?? {};

  const certificationsB = matchB.certifications ?? {};

  const factors = [
    compareNumericFactor({
      name: "overallMatchScore",

      candidateA: matchA.score,

      candidateB: matchB.score,
    }),

    compareNumericFactor({
      name: "rankingScore",

      candidateA: analysisA.rankingScore,

      candidateB: analysisB.rankingScore,
    }),

    compareNumericFactor({
      name: "requiredSkillMatch",

      candidateA: skillsA.requiredMatchPercentage,

      candidateB: skillsB.requiredMatchPercentage,
    }),

    compareNumericFactor({
      name: "preferredSkillMatch",

      candidateA: skillsA.preferredMatchPercentage,

      candidateB: skillsB.preferredMatchPercentage,
    }),

    compareNumericFactor({
      name: "experienceScore",

      candidateA: experienceA.score,

      candidateB: experienceB.score,
    }),

    compareNumericFactor({
      name: "educationScore",

      candidateA: educationA.score,

      candidateB: educationB.score,
    }),
    compareNumericFactor({
      name: "certificationMatch",

      candidateA: certificationsA.matchPercentage,

      candidateB: certificationsB.matchPercentage,
    }),
  ];

  const rankA = safeNumber(analysisA.rank);

  const rankB = safeNumber(analysisB.rank);

  factors.push(
    compareNumericFactor({
      name: "rank",

      candidateA: rankA,

      candidateB: rankB,

      higherIsBetter: false,
    }),
  );

  const winner =
    analysisA.rankingScore === analysisB.rankingScore
      ? "tie"
      : analysisA.rankingScore > analysisB.rankingScore
        ? "candidateA"
        : "candidateB";

  const skillAdvantages = {
    candidateA: {
      matchedRequiredSkills: skillsA.matchedRequiredSkills ?? [],

      missingRequiredSkills: skillsA.missingRequiredSkills ?? [],

      matchedPreferredSkills: skillsA.matchedPreferredSkills ?? [],

      missingPreferredSkills: skillsA.missingPreferredSkills ?? [],
    },

    candidateB: {
      matchedRequiredSkills: skillsB.matchedRequiredSkills ?? [],

      missingRequiredSkills: skillsB.missingRequiredSkills ?? [],

      matchedPreferredSkills: skillsB.matchedPreferredSkills ?? [],

      missingPreferredSkills: skillsB.missingPreferredSkills ?? [],
    },
  };

  const certificationAdvantages = {
  candidateA: {
    required: certificationsA.required ?? 0,
    exactMatches: certificationsA.exactMatches ?? [],
    partialMatches: certificationsA.partialMatches ?? [],
    missing: certificationsA.missing ?? [],
    score: certificationsA.score ?? 100,
    matchPercentage: certificationsA.matchPercentage ?? 100,
  },

  candidateB: {
    required: certificationsB.required ?? 0,
    exactMatches: certificationsB.exactMatches ?? [],
    partialMatches: certificationsB.partialMatches ?? [],
    missing: certificationsB.missing ?? [],
    score: certificationsB.score ?? 100,
    matchPercentage: certificationsB.matchPercentage ?? 100,
  },
};

  const strongerFactors = factors.filter((factor) => factor.winner !== "tie");

  return {
    jobId: jobObjectId,

    winner,

    candidateA: {
      analysisId: analysisA._id,

      candidateId: analysisA.candidateId?._id ?? candidateA,

      name: analysisA.candidateId?.name ?? null,

      email: analysisA.candidateId?.email ?? null,

      rank: analysisA.rank,

      rankingScore: analysisA.rankingScore,

      matchScore: matchA.score ?? 0,

      eligible: analysisA.eligible,

      eligibilityReasons: analysisA.eligibilityReasons ?? [],
    },

    candidateB: {
      analysisId: analysisB._id,

      candidateId: analysisB.candidateId?._id ?? candidateB,

      name: analysisB.candidateId?.name ?? null,

      email: analysisB.candidateId?.email ?? null,

      rank: analysisB.rank,

      rankingScore: analysisB.rankingScore,

      matchScore: matchB.score ?? 0,

      eligible: analysisB.eligible,

      eligibilityReasons: analysisB.eligibilityReasons ?? [],
    },

    factors,

    skillAdvantages,
    certifications: certificationAdvantages,

    experience: {
      candidateA: {
        years: experienceA.candidateYears ?? null,

        requiredYears: experienceA.requiredYears ?? null,

        matched: experienceA.matched ?? false,

        score: experienceA.score ?? 0,
      },

      candidateB: {
        years: experienceB.candidateYears ?? null,

        requiredYears: experienceB.requiredYears ?? null,

        matched: experienceB.matched ?? false,

        score: experienceB.score ?? 0,
      },
    },

    education: {
      candidateA: {
        matched: educationA.matched ?? false,

        score: educationA.score ?? 0,

        matchedRequirements: educationA.matchedRequirements ?? [],

        missingRequirements: educationA.missingRequirements ?? [],
      },

      candidateB: {
        matched: educationB.matched ?? false,

        score: educationB.score ?? 0,

        matchedRequirements: educationB.matchedRequirements ?? [],

        missingRequirements: educationB.missingRequirements ?? [],
      },
    },

    strongerFactors: strongerFactors.map((factor) => ({
      factor: factor.factor,

      winner: factor.winner,

      difference: factor.difference,
    })),
  };
};

export const buildComparisonSummary = (comparison) => {
  if (!comparison || typeof comparison !== "object") {
    throw new Error("Comparison result is required");
  }

  if (comparison.winner === "tie") {
    return {
      winner: "tie",

      summary: "Both candidates have the same ranking score.",

      reasons: [],
    };
  }

  const winner =
    comparison.winner === "candidateA"
      ? comparison.candidateA
      : comparison.candidateB;

  const loser =
    comparison.winner === "candidateA"
      ? comparison.candidateB
      : comparison.candidateA;

  const winnerLabel = winner.name ?? String(winner.candidateId);

  const loserLabel = loser.name ?? String(loser.candidateId);

  const reasons = comparison.strongerFactors
    .filter((factor) => factor.winner === comparison.winner)
    .map((factor) => `${factor.factor} advantage of ${factor.difference}`);

  return {
    winner: comparison.winner,

    summary: `${winnerLabel} ranked higher than ${loserLabel}.`,

    reasons,
  };
};
