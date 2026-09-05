const PROJECT_SEPARATOR_PATTERN =
  /\s+[—–-]\s+/;

export const isProjectLine = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  const text = line.trim();

  if (!text) {
    return false;
  }

  return (
    PROJECT_SEPARATOR_PATTERN.test(text) ||
    /^[•●▪◦]/.test(text)
  );
};