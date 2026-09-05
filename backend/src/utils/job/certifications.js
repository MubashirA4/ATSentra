const CERTIFICATION_PATTERN =
  /\b(certification|certified|certificate|credential|license|licence)\b/i;

const cleanLine = (line) => {
  if (!line || typeof line !== "string") {
    return "";
  }

  return line
    .replace(/^[•\-*▪◦●]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
};

const extractCertificationName = (line) => {
  const cleaned = cleanLine(line);

  if (!cleaned || !CERTIFICATION_PATTERN.test(cleaned)) {
    return "";
  }

  return cleaned
    .replace(
      /\b(is\s+)?(required|preferred|desired|mandatory|recommended)\b/gi,
      "",
    )
    .replace(/\s+/g, " ")
    .replace(/[.,;:]+$/, "")
    .trim();
};

export const isCertificationLine = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  return CERTIFICATION_PATTERN.test(line);
};

export const extractJobCertifications = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }

  return lines
    .map(extractCertificationName)
    .filter(Boolean);
};