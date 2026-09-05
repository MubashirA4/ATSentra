export const normalizeExperienceText = (line) => {
  if (!line) {
    return "";
  }

  return line
    .trim()
    .replace(/^[•●▪◦○*-]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const isPdfArtifact = (line) => {
  if (!line) {
    return false;
  }

  const normalized = line.trim().toLowerCase();

  return (
    /^--\s*\d+\s+of\s+\d+\s*--$/i.test(normalized) ||
    /^page\s+\d+$/i.test(normalized)
  );
};

export const uniqueLines = (lines) => {
  const seen = new Set();

  return lines.filter((line) => {
    const normalized = line.toLowerCase();

    if (seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);

    return true;
  });
};