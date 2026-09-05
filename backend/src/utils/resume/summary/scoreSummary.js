export const scoreSummary = (summary = "") => {
  const issues = [];
  const strengths = [];

  if (!summary.trim()) {
    return {
      score: 0,
      maxScore: 10,
      issues: ["Professional summary is missing"],
      strengths: [],
    };
  }

  let score = 5;

  strengths.push("Professional summary is present");

  const wordCount = summary
    .trim()
    .split(/\s+/)
    .length;

  if (wordCount >= 30) {
    score += 2;
  } else {
    issues.push("Summary is too short");
  }

  if (wordCount <= 100) {
    score += 1;
  } else {
    issues.push("Summary may be too long");
  }

  if (/\b(?:years?|experience)\b/i.test(summary)) {
    score += 1;
  }

  if (
    /\b(?:developer|engineer|designer|manager|analyst|specialist)\b/i.test(
      summary
    )
  ) {
    score += 1;
  }

  return {
    score: Math.min(score, 10),
    maxScore: 10,
    issues,
    strengths,
  };
};