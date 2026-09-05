const getCertificationName = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return value.name ?? "";
  }

  return "";
};

const normalizeCertification = (value) => {
  return getCertificationName(value)
    .toLowerCase()
    .trim()
    .replace(/[.,()\-_/]+/g, " ")
    .replace(/\s+/g, " ");
};

const GENERIC_CERTIFICATION_TERMS = new Set([
  "certification",
  "certified",
  "certificate",
  "credential",
  "qualification",
]);

const getMeaningfulTokens = (value) => {
  return normalizeCertification(value)
    .split(" ")
    .filter((token) => token && !GENERIC_CERTIFICATION_TERMS.has(token));
};

const calculatePartialScore = (
  requiredCertification,
  candidateCertification,
) => {
  const requiredTokens = getMeaningfulTokens(requiredCertification);

  const candidateTokens = new Set(getMeaningfulTokens(candidateCertification));

  if (requiredTokens.length === 0 || candidateTokens.size === 0) {
    return 0;
  }

  const matchedTokens = requiredTokens.filter((token) =>
    candidateTokens.has(token),
  );

  return matchedTokens.length / requiredTokens.length;
};

const matchCertification = (requiredCertification, candidateCertifications) => {
  const normalizedRequired = normalizeCertification(requiredCertification);

  if (!normalizedRequired) {
    return null;
  }

  let bestMatch = null;

  for (const candidateCertification of candidateCertifications) {
    const normalizedCandidate = normalizeCertification(candidateCertification);

    if (!normalizedCandidate) {
      continue;
    }

    // Exact certification match
    if (normalizedRequired === normalizedCandidate) {
      return {
        required: getCertificationName(requiredCertification),
        candidate: getCertificationName(candidateCertification),
        status: "exact",
        score: 100,
      };
    }

    const partialScore = calculatePartialScore(
      requiredCertification,
      candidateCertification,
    );

    if (partialScore > 0 && (!bestMatch || partialScore > bestMatch.rawScore)) {
      bestMatch = {
        required: getCertificationName(requiredCertification),
        candidate: getCertificationName(candidateCertification),
        status: "partial",
        score: Math.round(partialScore * 60),
        rawScore: partialScore,
      };
    }
  }

  if (bestMatch) {
    delete bestMatch.rawScore;
    return bestMatch;
  }

  return {
    required: requiredCertification,
    candidate: null,
    status: "missing",
    score: 0,
  };
};

export const matchCertifications = ({
  candidateCertifications = [],
  requiredCertifications = [],
}) => {
  if (!Array.isArray(candidateCertifications)) {
    candidateCertifications = [];
  }

  if (!Array.isArray(requiredCertifications)) {
    requiredCertifications = [];
  }

  if (requiredCertifications.length === 0) {
    return {
      required: 0,
      exactMatches: [],
      partialMatches: [],
      missing: [],
      score: 100,
      matchPercentage: 100,
      details: [],
    };
  }

  const details = requiredCertifications
    .map((requiredCertification) =>
      matchCertification(requiredCertification, candidateCertifications),
    )
    .filter(Boolean);

  const exactMatches = details.filter((item) => item.status === "exact");

  const partialMatches = details.filter((item) => item.status === "partial");

  const missing = details.filter((item) => item.status === "missing");

  const totalScore = details.reduce((sum, item) => sum + item.score, 0);

  const score =
    details.length === 0 ? 100 : Math.round(totalScore / details.length);

  return {
    required: requiredCertifications.length,
    exactMatches,
    partialMatches,
    missing,
    score,
    matchPercentage: score,
    details,
  };
};
