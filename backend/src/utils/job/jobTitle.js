import { cleanLine } from "../shared/textUtils.js";

const JOB_TITLE_PATTERNS = [
  /^job\s*title\s*[:\-]\s*(.+)$/i,
  /^position\s*[:\-]\s*(.+)$/i,
  /^role\s*[:\-]\s*(.+)$/i,
  /^title\s*[:\-]\s*(.+)$/i,
];

const JOB_TITLE_EXCLUDED = [
  "about",
  "about the role",
  "responsibilities",
  "requirements",
  "qualifications",
  "preferred qualifications",
  "education",
  "skills",
];

const JOB_SECTION_HEADINGS = [
  "about",
  "about the company",
  "about us",
  "about the role",
  "role overview",
  "job overview",
  "responsibilities",
  "job responsibilities",
  "key responsibilities",
  "requirements",
  "job requirements",
  "qualifications",
  "required qualifications",
  "preferred qualifications",
  "preferred skills",
  "nice to have",
  "education",
  "skills",
  "benefits",
];

export const extractJobTitle = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return null;
  }

  for (const line of lines) {
    const cleaned = cleanLine(line);

    for (const pattern of JOB_TITLE_PATTERNS) {
      const match = cleaned.match(pattern);

      if (match) {
        return match[1].trim();
      }
    }
  }

  for (const line of lines) {
    const cleaned = cleanLine(line);
    const normalized = cleaned.toLowerCase();

    if (!cleaned) continue;

    if (JOB_SECTION_HEADINGS.some((value) => normalized === value)) {
      return null;
    }

    if (/^\d+[\.\)]/.test(cleaned)) {
      continue;
    }

    return cleaned;
  }

  return null;
};
