export const scoreAchievements = (
  achievements = []
) => {
  if (
    !Array.isArray(achievements) ||
    achievements.length === 0
  ) {
    return {
      score: 0,
      maxScore: 5,
      issues: [],
      strengths: [],
    };
  }

  return {
    score: Math.min(
      achievements.length,
      5
    ),
    maxScore: 5,
    issues: [],
    strengths: [
      "Achievements are present",
    ],
  };
};