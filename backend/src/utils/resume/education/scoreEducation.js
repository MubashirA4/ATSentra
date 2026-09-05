export const scoreEducation = (
  education = []
) => {
  const issues = [];
  const strengths = [];

  if (
    !Array.isArray(education) ||
    education.length === 0
  ) {
    return {
      score: 0,
      maxScore: 10,
      issues: ["Education is missing"],
      strengths: [],
    };
  }

  let score = 4;

  for (const item of education) {
    if (item.degree) {
      score += 2;
    }

    if (item.institution) {
      score += 2;
    }

    if (
      item.startDate ||
      item.endDate
    ) {
      score += 1;
    }

    if (item.location) {
      score += 1;
    }
  }

  strengths.push("Education information detected");

  return {
    score: Math.min(score, 10),
    maxScore: 10,
    issues,
    strengths,
  };
};