const SEPARATOR_PATTERN =
  /\s+[—–-]\s+/;

export const extractProjectName = (line) => {
  if (!line || typeof line !== "string") {
    return null;
  }

  const cleaned = line
    .replace(/^[•●▪◦*-]\s*/, "")
    .trim();

  const match = cleaned.match(SEPARATOR_PATTERN);

  if (match) {
    return cleaned
      .slice(0, match.index)
      .trim();
  }

  return cleaned;
};