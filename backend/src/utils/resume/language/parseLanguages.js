import {
  detectLanguageSection,
} from "./detectLanguageSection.js";

import {
  isLanguageLine,
} from "./line.js";

import {
  tokenizeLanguageLines,
} from "./tokenize.js";

import {
  normalizeLanguages,
} from "./normalize.js";

import {
  deduplicateLanguages,
} from "./deduplicate.js";

import {
  validateLanguages,
} from "./validate.js";

export const parseLanguages = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }

  const section = detectLanguageSection(lines);

  if (!section) {
    return [];
  }

  const languageLines = section.lines.filter(
    isLanguageLine
  );

  const tokens =
    tokenizeLanguageLines(languageLines);

  const normalizedLanguages =
    normalizeLanguages(tokens);

  const uniqueLanguages =
    deduplicateLanguages(normalizedLanguages);

  const validation =
    validateLanguages(uniqueLanguages);

  if (!validation.valid) {
    return [];
  }

  return uniqueLanguages;
};