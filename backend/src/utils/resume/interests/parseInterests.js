import {
  detectInterestsSection,
} from "./detectInterestsSection.js";

import {
  isInterestLine,
} from "./line.js";

import {
  tokenizeInterestLines,
} from "./tokenize.js";

import {
  normalizeInterests,
} from "./normalize.js";

import {
  deduplicateInterests,
} from "./deduplicate.js";

import {
  validateInterests,
} from "./validate.js";

export const parseInterests = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }

  const section = detectInterestsSection(lines);

  if (!section) {
    return [];
  }

  const interestLines = section.lines.filter(
    isInterestLine
  );

  const tokens =
    tokenizeInterestLines(interestLines);

  const normalizedInterests =
    normalizeInterests(tokens);

  const uniqueInterests =
    deduplicateInterests(normalizedInterests);

  const validation =
    validateInterests(uniqueInterests);

  if (!validation.valid) {
    return [];
  }

  return uniqueInterests;
};