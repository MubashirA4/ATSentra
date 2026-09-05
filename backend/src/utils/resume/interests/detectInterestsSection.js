const INTEREST_HEADINGS = [
  "INTERESTS",
  "INTEREST",
  "HOBBIES",
  "HOBBIES & INTERESTS",
  "PERSONAL INTERESTS",
];

export const isInterestsSectionHeading = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  return INTEREST_HEADINGS.includes(
    line.trim().toUpperCase()
  );
};

export const detectInterestsSection = (lines) => {
  if (!Array.isArray(lines)) {
    return null;
  }

  const startIndex = lines.findIndex(
    isInterestsSectionHeading
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

    // Stop when another major uppercase section begins.
    if (/^[A-Z][A-Z\s&]+$/.test(line)) {
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