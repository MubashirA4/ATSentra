const BULLET_PATTERN = /^[•●▪◦○*-]\s*/;

const SKILL_SEPARATOR_PATTERN = /[•●▪◦○|,;]+/;

const NON_SKILL_LINE_PATTERNS = [
  /^(professional|work|employment) experience$/i,
  /^education$/i,
  /^projects?$/i,
  /^certifications?$/i,
  /^achievements?$/i,
  /^languages?$/i,
  /^interests?$/i,
];
const PAGE_MARKER_PATTERN = /^-+\s*\d+\s+of\s+\d+\s*-+$/i;

export const isSkillLine = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  const cleaned = line
    .trim()
    .replace(BULLET_PATTERN, "")
    .trim();

  if (!cleaned) {
    return false;
  }

  // Ignore PDF page-number artifacts such as:
  // -- 1 of 2 --
  // -- 2 of 2 --
  if (PAGE_MARKER_PATTERN.test(cleaned)) {
    return false;
  }

  if (
    NON_SKILL_LINE_PATTERNS.some((pattern) =>
      pattern.test(cleaned)
    )
  ) {
    return false;
  }

  // A skill section may contain:
  //
  // Python
  // SQL
  // TensorFlow
  //
  // as well as:
  //
  // Python, SQL, TensorFlow
  // JavaScript • React • Node.js
  //
  // Since this function is called specifically on the
  // skills section, a non-empty line is considered a
  // potential skill line.
  return true;
};