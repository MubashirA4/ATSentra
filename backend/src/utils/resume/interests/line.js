export const isInterestLine = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  const cleaned = line
    .replace(/^[•●▪◦*-]\s*/, "")
    .trim();

  if (!cleaned) {
    return false;
  }

  // Ignore obvious page artifacts.
  if (/^--\s*\d+\s+of\s+\d+\s*--$/i.test(cleaned)) {
    return false;
  }

  return true;
};