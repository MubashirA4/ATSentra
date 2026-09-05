const getMatchedRequiredSkills = (matchResult) => {
  return matchResult?.skills?.matchedRequiredSkills || [];
};

const getMissingRequiredSkills = (matchResult) => {
  return matchResult?.skills?.missingRequiredSkills || [];
};

const getMatchedPreferredSkills = (matchResult) => {
  return matchResult?.skills?.matchedPreferredSkills || [];
};

const getMissingPreferredSkills = (matchResult) => {
  return matchResult?.skills?.missingPreferredSkills || [];
};

const getCertificationScore = (matchResult) => {
  return matchResult?.certifications?.matchPercentage ?? 100;
};

const getMatchedCertifications = (matchResult) => {
  return matchResult?.certifications?.exactMatches || [];
};

const getPartialCertifications = (matchResult) => {
  return matchResult?.certifications?.partialMatches || [];
};

const getMissingCertifications = (matchResult) => {
  return matchResult?.certifications?.missing || [];
};

export const generateRankingExplanation = ({
  matchResult,
  eligible = false,
  eligibilityReasons = [],
}) => {
  if (!matchResult || typeof matchResult !== "object") {
    return {
      summary: "Candidate could not be evaluated.",
      strengths: [],
      weaknesses: [],
      missingRequirements: [],
      reasons: [],
    };
  }

  const requiredSkillPercentage =
    matchResult.skills?.requiredMatchPercentage ?? 0;

  const preferredSkillPercentage =
    matchResult.skills?.preferredMatchPercentage ?? 0;

  const candidateYears = matchResult.experience?.candidateYears ?? 0;

  const requiredYears = matchResult.experience?.requiredYears ?? null;

  const educationMatched = matchResult.education?.matched ?? false;

  const certificationScore = getCertificationScore(matchResult);

  const matchedCertifications = getMatchedCertifications(matchResult);

  const partialCertifications = getPartialCertifications(matchResult);

  const missingCertifications = getMissingCertifications(matchResult);

  const matchedRequiredSkills = getMatchedRequiredSkills(matchResult);

  const missingRequiredSkills = getMissingRequiredSkills(matchResult);

  const matchedPreferredSkills = getMatchedPreferredSkills(matchResult);

  const missingPreferredSkills = getMissingPreferredSkills(matchResult);

  const strengths = [];
  const weaknesses = [];
  const missingRequirements = [];
  const reasons = [];

  // -----------------------------------------
  // Required skills
  // -----------------------------------------

  if (requiredSkillPercentage === 100) {
    strengths.push("Matches all required skills.");
  } else if (requiredSkillPercentage >= 80) {
    strengths.push(
      `Strong required-skill match (${requiredSkillPercentage}%).`,
    );
  } else if (requiredSkillPercentage > 0) {
    weaknesses.push(`Required-skill match is ${requiredSkillPercentage}%.`);
  }

  // -----------------------------------------
  // Experience
  // -----------------------------------------

  if (matchResult.experience?.matched) {
    if (requiredYears !== null) {
      strengths.push(
        `Meets the required experience of ${requiredYears}+ years with approximately ${candidateYears} years.`,
      );
    } else {
      strengths.push("Meets the experience requirement.");
    }
  } else {
    if (requiredYears !== null) {
      weaknesses.push(
        `Candidate has approximately ${candidateYears} years of experience, below the required ${requiredYears}+ years.`,
      );
    } else {
      weaknesses.push(
        `Candidate has approximately ${candidateYears} years of experience and does not meet the experience requirement.`,
      );
    }
  }
  // -----------------------------------------
  // Education
  // -----------------------------------------

  if (educationMatched) {
    strengths.push("Meets the education requirement.");
  } else {
    weaknesses.push("Does not meet the education requirement.");
  }

  // -----------------------------------------
  // Preferred skills
  // -----------------------------------------

  if (preferredSkillPercentage === 100) {
    strengths.push("Matches all preferred skills.");
  } else if (preferredSkillPercentage > 0) {
    strengths.push(`Matches ${preferredSkillPercentage}% of preferred skills.`);
  }

  // -----------------------------------------
  // Certifications
  // -----------------------------------------

  if (certificationScore === 100) {
    if (matchedCertifications.length > 0) {
      strengths.push("Matches all required certifications.");
    }
  } else if (certificationScore >= 60) {
    strengths.push(
      `Has a partial certification match (${certificationScore}%).`,
    );
  } else if (certificationScore > 0) {
    weaknesses.push(`Certification match is ${certificationScore}%.`);
  }

  for (const certification of partialCertifications) {
    if (certification?.required && certification?.candidate) {
      weaknesses.push(
        `Partial certification match: ${certification.required} → ${certification.candidate}.`,
      );
    }
  }

  for (const certification of missingCertifications) {
    if (certification?.required) {
      missingRequirements.push(
        `Missing required certification: ${certification.required}`,
      );
    }
  }
  // -----------------------------------------
  // Missing required skills
  // -----------------------------------------

  for (const skill of missingRequiredSkills) {
    missingRequirements.push(`Missing required skill: ${skill}`);
  }

  // -----------------------------------------
  // Missing preferred skills
  // -----------------------------------------

  for (const skill of missingPreferredSkills) {
    weaknesses.push(`Missing preferred skill: ${skill}`);
  }

  // -----------------------------------------
  // Eligibility
  // -----------------------------------------

  if (eligible) {
    reasons.push("Candidate satisfies the configured eligibility thresholds.");
  } else {
    for (const reason of eligibilityReasons) {
      reasons.push(reason);
    }
  }

  // -----------------------------------------
  // Summary
  // -----------------------------------------

  const summary = eligible
    ? `Candidate achieved a ${matchResult.score}% match and satisfies the configured job requirements.`
    : `Candidate achieved a ${matchResult.score}% match but does not satisfy all configured eligibility requirements.`;

  return {
    summary,
    strengths,
    weaknesses,
    matchedRequiredSkills,
    missingRequirements,
    reasons,
    matchedPreferredSkills,
    certifications: {
      score: certificationScore,
      matched: matchedCertifications,
      partial: partialCertifications,
      missing: missingCertifications,
    },
  };
};
