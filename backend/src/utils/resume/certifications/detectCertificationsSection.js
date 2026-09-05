const CERTIFICATION_HEADINGS = [
  "CERTIFICATIONS",
  "CERTIFICATION",
  "LICENSES & CERTIFICATIONS",
  "LICENSES AND CERTIFICATIONS",
  "PROFESSIONAL CERTIFICATIONS",
  "CERTIFICATES",
];

export const isCertificationSectionHeading = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  const normalized = line
    .trim()
    .replace(/[:\-]+$/, "")
    .replace(/\s+/g, " ")
    .toUpperCase();

  return CERTIFICATION_HEADINGS.includes(normalized);
};

export const detectCertificationsSection = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return null;
  }

  const startIndex = lines.findIndex(
    isCertificationSectionHeading
  );

  if (startIndex === -1) {
    return null;
  }

  const sectionLines = [];

  for (
    let i = startIndex + 1;
    i < lines.length;
    i++
  ) {
    const line = lines[i]?.trim();

    if (!line) {
      continue;
    }

    // Stop when another major section begins.
    if (
      /^(PROFESSIONAL EXPERIENCE|EXPERIENCE|EDUCATION|PROJECTS|SKILLS|TECHNICAL SKILLS|LANGUAGES|INTERESTS|ACHIEVEMENTS)$/i.test(
        line
      )
    ) {
      break;
    }

    sectionLines.push(line);
  }

  return {
    title: lines[startIndex].trim(),
    startIndex,
    endIndex: startIndex + sectionLines.length + 1,
    lines: sectionLines,
  };
};