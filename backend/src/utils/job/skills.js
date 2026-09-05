import { parseSkills } from "../resume/skills/index.js";

const NON_SKILL_PATTERNS = [
  /\b\d+\+?\s*years?\b/i,
  /\byears?\s+of\s+(?:experience|work)\b/i,
  /\b(?:bachelor|master|phd|doctorate|degree|diploma)\b/i,
  /\b(?:experience|experienced)\s+(?:in|with)\b/i,
  /\bminimum\b/i,
  /\brequired\s+experience\b/i,
  /\beducation(?:al)?\s+(?:requirement|qualification)/i,

  // Certifications are not skills.
  /\b(?:certification|certified|certificate|credential|license|licence)\b/i,
];

const looksLikeNonSkillRequirement = (line) => {
  if (!line || typeof line !== "string") {
    return true;
  }

  return NON_SKILL_PATTERNS.some((pattern) => pattern.test(line));
};

export const extractJobSkills = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }

  const skillLines = lines.filter(
    (line) => !looksLikeNonSkillRequirement(line),
  );

  return parseSkills(skillLines);
};