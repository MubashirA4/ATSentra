const BULLET_PATTERN = /^[•●▪◦○*-]\s*/;

const PAGE_ARTIFACT_PATTERN =
  /^[-–—]*\s*\d+\s+of\s+\d+\s*[-–—]*$/i;

export const isCertificationLine = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  const cleaned = line.trim();

  if (!cleaned) {
    return false;
  }

  if (PAGE_ARTIFACT_PATTERN.test(cleaned)) {
    return false;
  }

  return true;
};

export const cleanCertificationLine = (line) => {
  return line
    .trim()
    .replace(BULLET_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim();
};