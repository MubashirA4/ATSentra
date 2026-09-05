export const validateRankingConfig = (config = {}) => {
  const errors = [];

  const {
    minimumMatchScore = 60,
    minimumRequiredSkillPercentage = 70,
    topCandidates = null,
  } = config;

  if (minimumMatchScore < 0 || minimumMatchScore > 100) {
    errors.push("minimumMatchScore must be between 0 and 100");
  }

  if (
    minimumRequiredSkillPercentage < 0 ||
    minimumRequiredSkillPercentage > 100
  ) {
    errors.push("minimumRequiredSkillPercentage must be between 0 and 100");
  }

  if (
    topCandidates !== null &&
    (!Number.isInteger(topCandidates) || topCandidates <= 0)
  ) {
    errors.push("topCandidates must be a positive integer or null");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
