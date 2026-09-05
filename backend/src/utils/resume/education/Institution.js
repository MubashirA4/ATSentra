const INSTITUTION_PATTERN =
  /\b(university|college|institute|school|academy|polytechnic)\b/i;

const KNOWN_INSTITUTION_PATTERN =
  /^(LUMS|NUST|FAST|GIKI|IBA|COMSATS|NED|UET)(?:\s|$)/i;

const EDUCATION_DATE_PATTERN =
  /\b\d{4}\s*(?:-|–|—|to)\s*(?:\d{4}|present|current)\b/gi;

export const isInstitutionLine = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  const cleaned = line.trim();

  return (
    INSTITUTION_PATTERN.test(cleaned) ||
    KNOWN_INSTITUTION_PATTERN.test(cleaned)
  );
};

export const extractInstitution = (line) => {
  if (!line || typeof line !== "string") {
    return null;
  }

  const cleaned = line
    .trim()
    .replace(/\s+/g, " ");

  const withoutDates = cleaned
    .replace(EDUCATION_DATE_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim();

  const parts = withoutDates
    .split(/\s+[—–-]\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    const possibleInstitution =
      parts[parts.length - 1];

    if (isInstitutionLine(possibleInstitution)) {
      return possibleInstitution;
    }
  }

  if (isInstitutionLine(withoutDates)) {
    return withoutDates;
  }

  return null;
};