const WEIGHTS = {
  requiredSkills: 50,
  experience: 20,
  education: 15,
  preferredSkills: 10,
  certifications: 5,
};

export const calculateMatchScore = ({
  skillMatch,
  certificationMatch,
  experienceMatch,
  educationMatch,
}) => {
  const requiredSkillScore =
    skillMatch.requiredMatchPercentage;

  const preferredSkillScore =
    skillMatch.preferredMatchPercentage;

  const certificationScore =
    certificationMatch?.score ?? 100;

  const experienceScore =
    experienceMatch.score;

  const educationScore =
    educationMatch.score;

  const score =
    (requiredSkillScore *
      WEIGHTS.requiredSkills) /
      100 +

    (experienceScore *
      WEIGHTS.experience) /
      100 +

    (educationScore *
      WEIGHTS.education) /
      100 +

    (preferredSkillScore *
      WEIGHTS.preferredSkills) /
      100 +

    (certificationScore *
      WEIGHTS.certifications) /
      100;

  return {
    score: Math.round(score),
    maxScore: 100,

    breakdown: {
      requiredSkills: {
        score: requiredSkillScore,
        weight: WEIGHTS.requiredSkills,
      },

      preferredSkills: {
        score: preferredSkillScore,
        weight: WEIGHTS.preferredSkills,
      },

      experience: {
        score: experienceScore,
        weight: WEIGHTS.experience,
      },

      education: {
        score: educationScore,
        weight: WEIGHTS.education,
      },

      certifications: {
        score: certificationScore,
        weight: WEIGHTS.certifications,
      },
    },
  };
};