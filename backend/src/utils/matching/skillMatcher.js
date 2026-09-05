const normalizeForComparison = (skill) => {
  return skill
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,]+$/g, "");
};

const normalizeSkill = (skill) => {
  const normalized = normalizeForComparison(skill);

  if (!normalized) {
    return "";
  }

  const aliases = {
    "react.js": "react",
    "reactjs": "react",

    "node.js": "node",
    "nodejs": "node",

    "express.js": "express",
    "expressjs": "express",
    "express js": "express",

    "mongodb": "mongodb",
    "mongo db": "mongodb",

    "tailwindcss": "tailwind css",
  };

  return aliases[normalized] || normalized;
};

export const matchSkills = ({
  candidateSkills = [],
  requiredSkills = [],
  preferredSkills = [],
}) => {
  const candidateSet = new Set(
    candidateSkills
      .map(normalizeSkill)
      .filter(Boolean),
  );

  const matchedRequiredSkills = [];
  const missingRequiredSkills = [];

  for (const skill of requiredSkills) {
    const normalized = normalizeSkill(skill);

    if (normalized && candidateSet.has(normalized)) {
      matchedRequiredSkills.push(skill);
    } else {
      missingRequiredSkills.push(skill);
    }
  }

  const matchedPreferredSkills = [];
  const missingPreferredSkills = [];

  for (const skill of preferredSkills) {
    const normalized = normalizeSkill(skill);

    if (normalized && candidateSet.has(normalized)) {
      matchedPreferredSkills.push(skill);
    } else {
      missingPreferredSkills.push(skill);
    }
  }

  const requiredMatchPercentage =
    requiredSkills.length === 0
      ? 100
      : Math.round(
          (matchedRequiredSkills.length / requiredSkills.length) * 100,
        );

  const preferredMatchPercentage =
    preferredSkills.length === 0
      ? 100
      : Math.round(
          (matchedPreferredSkills.length / preferredSkills.length) * 100,
        );

  return {
    matchedRequiredSkills,
    missingRequiredSkills,

    matchedPreferredSkills,
    missingPreferredSkills,

    requiredMatchPercentage,
    preferredMatchPercentage,
  };
};