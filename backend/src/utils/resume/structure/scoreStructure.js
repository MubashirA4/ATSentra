export const scoreStructure = (
  resume = {}
) => {
  const sections = [
    ["summary", resume.summary],
    ["skills", resume.skills],
    ["experience", resume.experience],
    ["education", resume.education],
    ["projects", resume.projects],
    [
      "certifications",
      resume.certifications,
    ],
  ];

  const presentSections =
    sections.filter(([, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return Boolean(value?.trim?.());
    });

  const score = Math.min(
    Math.round(
      (presentSections.length /
        sections.length) *
        5
    ),
    5
  );

  return {
    score,
    maxScore: 5,
    issues:
      presentSections.length < 4
        ? ["Resume is missing important sections"]
        : [],
    strengths:
      presentSections.length >= 5
        ? ["Resume has good section coverage"]
        : [],
  };
};