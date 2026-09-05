import { scoreResume } from "./scoreResume.js";

export const analyzeResumeQuality = (
  resume
) => {
  const result = scoreResume(resume);

  const allIssues = [];
  const allStrengths = [];

  for (const section of Object.values(
    result.breakdown
  )) {
    allIssues.push(...section.issues);
    allStrengths.push(
      ...section.strengths
    );
  }

  let rating = "Poor";

  if (result.percentage >= 80) {
    rating = "Excellent";
  } else if (result.percentage >= 65) {
    rating = "Good";
  } else if (result.percentage >= 50) {
    rating = "Average";
  }

  return {
    ...result,

    rating,

    strengths: [
      ...new Set(allStrengths),
    ],

    issues: [
      ...new Set(allIssues),
    ],
  };
};