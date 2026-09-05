const COMPANY_PATTERNS = [
  /^company\s*[:\-]\s*(.+)$/i,
  /^organization\s*[:\-]\s*(.+)$/i,
  /^employer\s*[:\-]\s*(.+)$/i,
];

export const extractCompany = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return null;
  }

  for (const line of lines) {
    if (!line || typeof line !== "string") {
      continue;
    }

    const text = line.trim();

    if (!text) {
      continue;
    }

    for (const pattern of COMPANY_PATTERNS) {
      const match = text.match(pattern);

      if (match) {
        return match[1].trim();
      }
    }
  }

  return null;
};