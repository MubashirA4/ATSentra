const normalizeEducation = (value) => {
  return value
    ?.toLowerCase()
    .trim();
};

const detectDegreeLevel = (text) => {
  const value = normalizeEducation(text);

  if (!value) return null;

  if (
    /\b(ph\.?d|doctorate|doctoral)\b/i.test(value)
  ) {
    return "phd";
  }

  if (
    /\b(master|master's|m\.s\.|m\.e\.|mba)\b/i.test(
      value,
    )
  ) {
    return "master";
  }

  if (
    /\b(bachelor|bachelor's|b\.s\.|b\.e\.)\b/i.test(
      value,
    )
  ) {
    return "bachelor";
  }

  return null;
};

export const matchEducation = ({
  education = [],
  requirements = [],
}) => {
  if (!requirements.length) {
    return {
      matched: true,
      score: 100,
      matchedRequirements: [],
      missingRequirements: [],
    };
  }

  const candidateDegrees = education
    .map((item) =>
      detectDegreeLevel(item.degree),
    )
    .filter(Boolean);

  const matchedRequirements = [];
  const missingRequirements = [];

  for (const requirement of requirements) {
    const requiredLevel =
      detectDegreeLevel(requirement);

    if (
      requiredLevel &&
      candidateDegrees.includes(requiredLevel)
    ) {
      matchedRequirements.push(requirement);
    } else {
      missingRequirements.push(requirement);
    }
  }

  const score = Math.round(
    (matchedRequirements.length /
      requirements.length) *
      100,
  );

  return {
    matched: missingRequirements.length === 0,
    score,
    matchedRequirements,
    missingRequirements,
  };
};