  const hasRequiredSkills = (matchResult) => {
    return (
      matchResult?.skills?.missingRequiredSkills?.length === 0
    );
  };

  const meetsExperienceRequirement = (matchResult) => {
    return matchResult?.experience?.matched === true;
  };

  const meetsEducationRequirement = (matchResult) => {
    return matchResult?.education?.matched === true;
  };

  export const evaluateCandidateEligibility = ({
    matchResult,
    config = {},
  }) => {
    if (!matchResult || typeof matchResult !== "object") {
      return {
        eligible: false,
        reasons: ["Match result is missing"],
      };
    }

    const {
      minimumMatchScore = 70,
      minimumRequiredSkillPercentage = 70,
      requireExperience = true,
      requireEducation = true,
    } = config;

    const reasons = [];

    const matchScore = matchResult.score ?? 0;

    const requiredSkillPercentage =
      matchResult.skills?.requiredMatchPercentage ?? 0;

    const experienceMatched =
      matchResult.experience?.matched ?? false;

    const educationMatched =
      matchResult.education?.matched ?? false;

    // -----------------------------------------
    // Minimum overall match score
    // -----------------------------------------

    if (matchScore < minimumMatchScore) {
      reasons.push(
        `Match score below minimum threshold (${minimumMatchScore}%)`,
      );
    }

    // -----------------------------------------
    // Required skill threshold
    // -----------------------------------------

    if (
      requiredSkillPercentage <
      minimumRequiredSkillPercentage
    ) {
      reasons.push(
        `Required skill match below minimum threshold (${minimumRequiredSkillPercentage}%)`,
      );
    }

    // -----------------------------------------
    // Experience requirement
    // -----------------------------------------

    if (
      requireExperience &&
      !experienceMatched
    ) {
      reasons.push(
        "Experience requirement not met",
      );
    }

    // -----------------------------------------
    // Education requirement
    // -----------------------------------------

    if (
      requireEducation &&
      !educationMatched
    ) {
      reasons.push(
        "Education requirement not met",
      );
    }

    return {
      eligible: reasons.length === 0,
      reasons,
    };
  };