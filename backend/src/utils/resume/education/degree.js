const DEGREE_PATTERNS = [
  /\b(ph\.?d\.?|doctor(?:ate)?|doctor of philosophy)\b/i,

  /\b(m\.?phil\.?|master of philosophy)\b/i,

  /\b(master(?:'s)?|m\.?sc\.?|m\.?s\.?|mba|m\.?a\.?|m\.?eng\.?)\b/i,

  /\b(bachelor(?:'s)?|b\.?sc\.?|b\.?s\.?|bba|b\.?a\.?|b\.?eng\.?)\b/i,

  /\b(associate(?:'s)?|a\.?s\.?|a\.?a\.?)\b/i,

  /\b(diploma|certificate)\b/i,
];

export const isDegreeLine = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  return DEGREE_PATTERNS.some((pattern) =>
    pattern.test(line.trim()),
  );
};

export const extractDegree = (line) => {
  if (!line || typeof line !== "string") {
    return null;
  }

  const cleaned = line
    .trim()
    .replace(/\s+/g, " ");

  if (!isDegreeLine(cleaned)) {
    return null;
  }

  const withoutDates = cleaned
    .replace(
      /\(?\s*(?:\d{4})(?:\s*(?:-|–|—|to)\s*(?:\d{4}|present|current))?\s*\)?/gi,
      "",
    )
    .trim();

  const parts = withoutDates
    .split(/\s+[—–-]\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 0) {
    return parts[0];
  }

  return withoutDates || null;
};