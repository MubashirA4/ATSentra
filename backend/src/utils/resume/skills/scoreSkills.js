export const scoreSkills = (skills = []) => {
  const issues = [];
  const strengths = [];

  if (!Array.isArray(skills) || skills.length === 0) {
    return {
      score: 0,
      maxScore: 15,
      issues: ["No skills detected"],
      strengths: [],
    };
  }

  let score = 5;

  if (skills.length >= 5) {
    score += 3;
    strengths.push("Good number of skills detected");
  } else {
    issues.push("Very few skills detected");
  }

  if (skills.length >= 10) {
    score += 2;
  }

  if (skills.length >= 15) {
    score += 2;
  }

  const uniqueCount =
    new Set(
      skills.map((skill) =>
        skill.toLowerCase()
      )
    ).size;

  if (uniqueCount === skills.length) {
    score += 1;
  } else {
    issues.push("Duplicate skills detected");
  }

  return {
    score: Math.min(score, 15),
    maxScore: 15,
    issues,
    strengths,
  };
};