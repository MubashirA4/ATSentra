export const scoreLanguages = (
  languages = []
) => {
  if (
    !Array.isArray(languages) ||
    languages.length === 0
  ) {
    return {
      score: 0,
      maxScore: 5,
      issues: [],
      strengths: [],
    };
  }

  let score = Math.min(
    languages.length,
    3
  );

  const hasProficiency =
    languages.some(
      (language) =>
        language.proficiency
    );

  if (hasProficiency) {
    score += 2;
  }

  return {
    score: Math.min(score, 5),
    maxScore: 5,
    issues: [],
    strengths: [
      "Languages are specified",
    ],
  };
};