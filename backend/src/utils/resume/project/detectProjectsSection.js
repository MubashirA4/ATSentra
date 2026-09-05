const PROJECT_HEADINGS = [
  "PROJECTS",
  "PERSONAL PROJECTS",
  "PROFESSIONAL PROJECTS",
  "KEY PROJECTS",
  "ACADEMIC PROJECTS",
  "PROJECT EXPERIENCE",
];

export const isProjectsHeading = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  const normalized = line
    .trim()
    .replace(/[:\-]+$/, "")
    .toUpperCase();

  return PROJECT_HEADINGS.includes(normalized);
};

export const detectProjectsSection = (lines) => {
  if (!Array.isArray(lines)) {
    return null;
  }

  const startIndex = lines.findIndex(isProjectsHeading);

  if (startIndex === -1) {
    return null;
  }

  const sectionLines = [];

  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];

    if (
      /^(PROFESSIONAL EXPERIENCE|EXPERIENCE|EDUCATION|CERTIFICATIONS|SKILLS|TECHNICAL SKILLS|LANGUAGES|INTERESTS)$/i.test(
        line.trim()
      )
    ) {
      break;
    }

    if (line.trim()) {
      sectionLines.push(line.trim());
    }
  }

  return {
    title: lines[startIndex],
    startIndex,
    endIndex: startIndex + sectionLines.length + 1,
    lines: sectionLines,
  };
};