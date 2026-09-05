const safeScore = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, number));
};

const getCandidateName = (candidate) => {
  return candidate?.name ?? candidate?.candidateId ?? "Candidate";
};

const getRankingScore = (candidate) => {
  return candidate?.rankingScore ?? 0;
};

const getRequiredSkillPercentage = (candidate) => {
  return safeScore(candidate?.matchResult?.skills?.requiredMatchPercentage);
};

const getPreferredSkillPercentage = (candidate) => {
  return safeScore(candidate?.matchResult?.skills?.preferredMatchPercentage);
};

const getExperienceScore = (candidate) => {
  return safeScore(candidate?.matchResult?.experience?.score);
};

const getEducationScore = (candidate) => {
  return safeScore(candidate?.matchResult?.education?.score);
};

const getCertificationScore = (candidate) => {
  return safeScore(candidate?.matchResult?.certifications?.matchPercentage);
};

const isEligible = (candidate) => {
  return candidate?.eligible === true;
};

export const compareCandidatesForExplanation = (
  higherRankedCandidate,
  lowerRankedCandidate,
) => {
  if (!higherRankedCandidate || !lowerRankedCandidate) {
    return {
      factor: "unknown",
      summary: "Ranking comparison could not be determined.",
      metrics: null,
      details: [],
    };
  }

  const higherName = getCandidateName(higherRankedCandidate);

  const lowerName = getCandidateName(lowerRankedCandidate);

  /*
   * ----------------------------------------
   * Collect all comparison metrics
   * ----------------------------------------
   */

  const higherEligible = isEligible(higherRankedCandidate);

  const lowerEligible = isEligible(lowerRankedCandidate);

  const higherRankingScore = getRankingScore(higherRankedCandidate);

  const lowerRankingScore = getRankingScore(lowerRankedCandidate);

  const higherRequiredSkills = getRequiredSkillPercentage(
    higherRankedCandidate,
  );

  const lowerRequiredSkills = getRequiredSkillPercentage(lowerRankedCandidate);

  const higherExperience = getExperienceScore(higherRankedCandidate);

  const lowerExperience = getExperienceScore(lowerRankedCandidate);

  const higherEducation = getEducationScore(higherRankedCandidate);

  const lowerEducation = getEducationScore(lowerRankedCandidate);

  const higherCertifications = getCertificationScore(higherRankedCandidate);

  const lowerCertifications = getCertificationScore(lowerRankedCandidate);

  const higherPreferredSkills = getPreferredSkillPercentage(
    higherRankedCandidate,
  );

  const lowerPreferredSkills =
    getPreferredSkillPercentage(lowerRankedCandidate);

  /*
   * ----------------------------------------
   * Determine the actual deciding factor
   * ----------------------------------------
   */

  let factor = "tieBreaker";
  let summary =
    "Both candidates have equivalent ranking metrics, so a deterministic tie-breaker was used.";

  /*
   * 1. Eligibility
   */

  if (higherEligible !== lowerEligible) {
    factor = "eligibility";

    summary = higherEligible
      ? `${higherName} ranked higher because the candidate meets the configured eligibility requirements, while ${lowerName} does not.`
      : `${lowerName} is eligible while ${higherName} is not.`;
  } else if (higherRankingScore !== lowerRankingScore) {
    /*
     * 2. Overall ranking score
     */
    factor = "rankingScore";

    summary = `${higherName} ranked higher because of a stronger overall match score (${higherRankingScore}% vs ${lowerRankingScore}%).`;
  } else if (higherRequiredSkills !== lowerRequiredSkills) {
    /*
     * 3. Required skills
     */
    factor = "requiredSkills";

    summary = `${higherName} ranked higher because of stronger required-skill coverage (${higherRequiredSkills}% vs ${lowerRequiredSkills}%).`;
  } else if (higherExperience !== lowerExperience) {
    /*
     * 4. Experience
     */
    factor = "experience";

    summary = `${higherName} ranked higher because of stronger experience matching (${higherExperience}% vs ${lowerExperience}%).`;
  } else if (higherPreferredSkills !== lowerPreferredSkills) {
    /*
     * 5. Preferred skills
     */
    factor = "preferredSkills";

    summary = `${higherName} ranked higher because of stronger preferred-skill coverage (${higherPreferredSkills}% vs ${lowerPreferredSkills}%).`;
  } else if (higherCertifications !== lowerCertifications) {

  /*
   * 6. Certifications
   */
    factor = "certifications";

    summary = `${higherName} ranked higher because of stronger certification matching (${higherCertifications}% vs ${lowerCertifications}%).`;
  }

  /*
   * ----------------------------------------
   * Full comparison metrics
   * ----------------------------------------
   */

  const metrics = {
    overallMatch: {
      higherRanked: higherRankingScore,
      lowerRanked: lowerRankingScore,
      difference: higherRankingScore - lowerRankingScore,
    },

    requiredSkills: {
      higherRanked: higherRequiredSkills,
      lowerRanked: lowerRequiredSkills,
      difference: higherRequiredSkills - lowerRequiredSkills,
    },

    experience: {
      higherRanked: higherExperience,
      lowerRanked: lowerExperience,
      difference: higherExperience - lowerExperience,
    },

    education: {
      higherRanked: higherEducation,
      lowerRanked: lowerEducation,
      difference: higherEducation - lowerEducation,
    },

    preferredSkills: {
      higherRanked: higherPreferredSkills,
      lowerRanked: lowerPreferredSkills,
      difference: higherPreferredSkills - lowerPreferredSkills,
    },

    certifications: {
      higherRanked: higherCertifications,
      lowerRanked: lowerCertifications,
      difference: higherCertifications - lowerCertifications,
    },

    eligibility: {
      higherRanked: higherEligible,
      lowerRanked: lowerEligible,
    },
  };

  /*
   * ----------------------------------------
   * Human-readable details
   * ----------------------------------------
   */

  const details = [
    `Overall match: ${higherRankingScore}% vs ${lowerRankingScore}%`,
    `Required skills: ${higherRequiredSkills}% vs ${lowerRequiredSkills}%`,
    `Experience: ${higherExperience}% vs ${lowerExperience}%`,
    `Education: ${higherEducation}% vs ${lowerEducation}%`,
    `Preferred skills: ${higherPreferredSkills}% vs ${lowerPreferredSkills}%`,
    `Certifications: ${higherCertifications}% vs ${lowerCertifications}%`,
    `Eligibility: ${higherEligible ? "Eligible" : "Ineligible"} vs ${
      lowerEligible ? "Eligible" : "Ineligible"
    }`,
  ];

  return {
    factor,
    summary,
    metrics,
    details,
  };
};
