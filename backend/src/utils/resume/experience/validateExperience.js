export const validateExperience = (experience) => {
  const errors = [];

  if (!experience || typeof experience !== "object") {
    return {
      valid: false,
      errors: ["Experience must be an object"],
    };
  }

  if (!experience.jobTitle?.trim()) {
    errors.push("Missing job title");
  }

  if (!experience.company?.trim()) {
    errors.push("Missing company");
  }

  if (!experience.startDate?.trim()) {
    errors.push("Missing start date");
  }

  if (experience.isCurrent && experience.endDate) {
    errors.push("Current experience cannot have an end date");
  }

  if (!experience.isCurrent && !experience.endDate) {
    errors.push("Non-current experience should have an end date");
  }

  if (!Array.isArray(experience.responsibilities)) {
    errors.push("Responsibilities must be an array");
  }

  if (!Array.isArray(experience.achievements)) {
    errors.push("Achievements must be an array");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
export const validateExperiences = (experiences) => {
  if (!Array.isArray(experiences)) {
    return {
      valid: false,
      errors: ["Experience must be an array"],
    };
  }

  return experiences.map((experience, index) => {
    const result = validateExperience(experience);

    return {
      index,
      ...result,
    };
  });
};