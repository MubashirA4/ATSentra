import { cleanLine } from "../shared/textUtils.js";

const DEGREE_PATTERNS = [
  /\bbachelor'?s?\b/i,
  /\bmaster'?s?\b/i,
  /\bph\.?d\.?\b/i,
  /\bdoctorate\b/i,
  /\bb\.?s\.?c\.?\b/i,
  /\bb\.?s\.?\b/i,
  /\bb\.?e\.?\b/i,
  /\bm\.?s\.?c\.?\b/i,
  /\bm\.?s\.?\b/i,
  /\bm\.?e\.?\b/i,
  /\bmba\b/i,
];

export const extractEducationRequirements = (lines) => {
  if (!Array.isArray(lines)) {
    return [];
  }

  return lines
    .map(cleanLine)
    .filter(Boolean)
    .filter((line) => DEGREE_PATTERNS.some((pattern) => pattern.test(line)));
};
