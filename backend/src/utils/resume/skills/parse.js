import { isSkillLine } from "./Line.js";
import { tokenizeSkillLines } from "./tokenize.js";
import { normalizeSkills } from "./normalize.js";
import { deduplicateSkills } from "./deduplicate.js";
import { validateSkills } from "./validate.js";

export const parseSkills = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }

  const skillLines = lines.filter(isSkillLine);

  if (skillLines.length === 0) {
    return [];
  }

  const tokens = tokenizeSkillLines(skillLines);

  const normalizedSkills = normalizeSkills(tokens);

  const uniqueSkills = deduplicateSkills(normalizedSkills);

  const validation = validateSkills(uniqueSkills);

  if (!validation.valid) {
    return [];
  }

  return uniqueSkills;
};
