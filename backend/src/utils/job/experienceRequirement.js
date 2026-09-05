const EXPERIENCE_PATTERNS = [
  {
    regex: /(\d+)\s*(?:[-–—]|to)\s*(\d+)\s*years?/i,
    parse: (match, raw) => ({
      minYears: Number(match[1]),
      maxYears: Number(match[2]),
      raw,
    }),
  },

  {
    regex: /(\d+)\s*\+\s*years?/i,
    parse: (match, raw) => ({
      minYears: Number(match[1]),
      maxYears: null,
      raw,
    }),
  },

  {
    regex: /(?:minimum\s+of|at\s+least|minimum)\s+(\d+)\s*years?/i,
    parse: (match, raw) => ({
      minYears: Number(match[1]),
      maxYears: null,
      raw,
    }),
  },
];

const isPreferredExperienceLine = (text) => {
  return /\b(preferred|prefer|desired|ideally|bonus|plus|would\s+be\s+preferred)\b/i.test(
    text,
  );
};

const isRequiredExperienceLine = (text) => {
  return /\b(required|required\s+experience|minimum|at\s+least|must|need(?:ed)?|mandatory)\b/i.test(
    text,
  );
};

const parseExperienceLine = (text) => {
  for (const pattern of EXPERIENCE_PATTERNS) {
    const match = text.match(pattern.regex);

    if (match) {
      return pattern.parse(match, text);
    }
  }

  return null;
};

export const extractExperienceRequirement = (lines) => {
  if (!Array.isArray(lines)) {
    return null;
  }

  const parsedExperiences = [];

  for (const line of lines) {
    if (!line || typeof line !== "string") {
      continue;
    }

    const text = line.trim();

    if (!text) {
      continue;
    }

    const experience = parseExperienceLine(text);

    if (!experience) {
      continue;
    }

    parsedExperiences.push({
      ...experience,
      preferred: isPreferredExperienceLine(text),
      required: isRequiredExperienceLine(text),
    });
  }

  if (parsedExperiences.length === 0) {
    return null;
  }

  // Prefer an explicitly required experience over a preferred one.
  const requiredExperience = parsedExperiences.find(
    (experience) => experience.required && !experience.preferred,
  );

  if (requiredExperience) {
    return {
      minYears: requiredExperience.minYears,
      maxYears: requiredExperience.maxYears,
      raw: requiredExperience.raw,
    };
  }

  // If no explicit required experience exists,
  // use the first non-preferred experience.
  const nonPreferredExperience = parsedExperiences.find(
    (experience) => !experience.preferred,
  );

  if (nonPreferredExperience) {
    return {
      minYears: nonPreferredExperience.minYears,
      maxYears: nonPreferredExperience.maxYears,
      raw: nonPreferredExperience.raw,
    };
  }

  // If everything is marked preferred, fall back to the first one.
  const fallback = parsedExperiences[0];

  return {
    minYears: fallback.minYears,
    maxYears: fallback.maxYears,
    raw: fallback.raw,
  };
};