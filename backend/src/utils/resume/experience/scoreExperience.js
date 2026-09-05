export const scoreExperience = (
  experiences = []
) => {
  const issues = [];
  const strengths = [];

  if (
    !Array.isArray(experiences) ||
    experiences.length === 0
  ) {
    return {
      score: 0,
      maxScore: 25,
      issues: ["No professional experience detected"],
      strengths: [],
    };
  }

  let score = 8;

  strengths.push(
    "Professional experience is present"
  );

  if (experiences.length >= 2) {
    score += 3;
  }

  for (const experience of experiences) {
    if (experience.jobTitle) {
      score += 1;
    }

    if (experience.company) {
      score += 1;
    }

    if (experience.startDate) {
      score += 1;
    }

    if (
      experience.isCurrent ||
      experience.endDate
    ) {
      score += 1;
    }

    if (
      experience.responsibilities?.length > 0
    ) {
      score += 1;
    }

    if (
      experience.achievements?.length > 0
    ) {
      score += 1;
    }
  }

  const cappedScore = Math.min(score, 25);

  if (
    experiences.some(
      (experience) =>
        !experience.responsibilities?.length
    )
  ) {
    issues.push(
      "Some experience entries have no responsibilities"
    );
  }

  if (
    experiences.some(
      (experience) =>
        !experience.achievements?.length
    )
  ) {
    issues.push(
      "Some experience entries have no achievements"
    );
  }

  return {
    score: cappedScore,
    maxScore: 25,
    issues,
    strengths,
  };
};