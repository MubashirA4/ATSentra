const BULLET_PATTERN = /^[•●▪◦○*-]\s*/;

const SKILL_SEPARATOR_PATTERN = /[•●▪◦○|,;]+/;

export const tokenizeSkillLine = (line) => {
  if (!line || typeof line !== "string") {
    return [];
  }

  const cleaned = line
    .trim()
    .replace(BULLET_PATTERN, "")
    .trim();

  if (!cleaned) {
    return [];
  }

  return cleaned
    .split(SKILL_SEPARATOR_PATTERN)
    .map((skill) => skill.trim())
    .filter(Boolean);
};

export const tokenizeSkillLines = (lines) => {
  if (!Array.isArray(lines)) {
    return [];
  }

  return lines.flatMap(tokenizeSkillLine);
};