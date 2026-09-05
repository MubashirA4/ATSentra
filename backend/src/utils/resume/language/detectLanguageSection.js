const LANGUAGE_HEADINGS = [
  "LANGUAGES",
  "LANGUAGE",
  "LANGUAGE SKILLS",
  "LANGUAGE PROFICIENCY",
];

export const isLanguageSectionHeading = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  return LANGUAGE_HEADINGS.includes(
    line.trim().toUpperCase()
  );
};

export const detectLanguageSection = (lines) => {
  if (!Array.isArray(lines)) {
    return null;
  }

  const startIndex = lines.findIndex(
    isLanguageSectionHeading
  );

  if (startIndex === -1) {
    return null;
  }

  const sectionLines = [];

  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i]?.trim();

    if (!line) {
      continue;
    }

    if (
      /^[A-Z][A-Z\s&]+$/.test(line) &&
      !isLanguageSectionHeading(line)
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