const EMPLOYMENT_TYPE_PATTERNS = [
  {
    type: "Full-Time",
    regex: /\bfull[-\s]?time\b/i,
  },
  {
    type: "Part-Time",
    regex: /\bpart[-\s]?time\b/i,
  },
  {
    type: "Contract",
    regex: /\bcontract(?:or)?\b/i,
  },
  {
    type: "Freelance",
    regex: /\bfreelanc(?:e|er)\b/i,
  },
  {
    type: "Internship",
    regex: /\bintern(?:ship)?\b/i,
  },
  {
    type: "Temporary",
    regex: /\btemp(?:orary)?\b/i,
  },
  {
    type: "Apprenticeship",
    regex: /\bapprentice(?:ship)?\b/i,
  },
];

const findEmploymentType = (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  for (const pattern of EMPLOYMENT_TYPE_PATTERNS) {
    if (pattern.regex.test(text)) {
      return pattern.type;
    }
  }

  return null;
};

export const extractEmploymentType = ({
  block = [],
  headerLines = [],
} = {}) => {
  if (!Array.isArray(block)) {
    return null;
  }

  // 1. Prefer employment type found in the experience header.
  if (Array.isArray(headerLines) && headerLines.length > 0) {
    const headerText = headerLines.join(" ");

    const headerEmploymentType = findEmploymentType(headerText);

    if (headerEmploymentType) {
      return headerEmploymentType;
    }
  }

  // 2. Fallback to the full block.
  const blockText = block.join(" ");

  return findEmploymentType(blockText);
};