export const scoreProjects = (
  projects = []
) => {
  if (
    !Array.isArray(projects) ||
    projects.length === 0
  ) {
    return {
      score: 0,
      maxScore: 10,
      issues: ["No projects detected"],
      strengths: [],
    };
  }

  let score = 4;

  if (projects.length >= 2) {
    score += 3;
  }

  if (projects.length >= 3) {
    score += 2;
  }

  const hasDetailedProject =
    projects.some(
      (project) =>
        typeof project === "string" &&
        project.length >= 80
    );

  if (hasDetailedProject) {
    score += 1;
  }

  return {
    score: Math.min(score, 10),
    maxScore: 10,
    issues: [],
    strengths: [
      "Projects section is present",
    ],
  };
};