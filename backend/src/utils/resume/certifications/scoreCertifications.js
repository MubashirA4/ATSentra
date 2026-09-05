export const scoreCertifications = (
  certifications = []
) => {
  if (
    !Array.isArray(certifications) ||
    certifications.length === 0
  ) {
    return {
      score: 0,
      maxScore: 5,
      issues: ["No certifications detected"],
      strengths: [],
    };
  }

  return {
    score: Math.min(certifications.length, 5),
    maxScore: 5,
    issues: [],
    strengths: [
      "Certifications are present",
    ],
  };
};