const SEPARATOR_PATTERN =
  /\s+[—–-]\s+/;

export const extractProjectDescription = (line) => {
  if (!line || typeof line !== "string") {
    return null;
  }

  const cleaned = line
    .replace(/^[•●▪◦*-]\s*/, "")
    .trim();

  const match = cleaned.match(SEPARATOR_PATTERN);

  if (!match) {
    return null;
  }

  return cleaned
    .slice(match.index + match[0].length)
    .trim();
};