const normalizeString = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .trim()
    .replace(/\s+/g, " ");

  return normalized || null;
};

const normalizeArray = (values) => {
  if (!Array.isArray(values)) {
    return [];
  }

  const seen = new Set();

  return values
    .map((value) => normalizeString(value))
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
};

export const normalizeExperience = (experience) => {
  if (!experience || typeof experience !== "object") {
    return null;
  }

  return {
    jobTitle: normalizeString(experience.jobTitle),

    company: normalizeString(experience.company),

    location: normalizeString(experience.location),

    startDate: normalizeString(experience.startDate),

    endDate: normalizeString(experience.endDate),

    isCurrent: Boolean(experience.isCurrent),

    employmentType: normalizeString(experience.employmentType),

    responsibilities: normalizeArray(
      experience.responsibilities,
    ),

    achievements: normalizeArray(
      experience.achievements,
    ),
  };
};

export const normalizeExperiences = (experiences) => {
  if (!Array.isArray(experiences)) {
    return [];
  }

  return experiences
    .map(normalizeExperience)
    .filter(Boolean);
};