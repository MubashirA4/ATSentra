import { extractProficiency } from "./proficiency.js";

export const normalizeLanguage = (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  const cleaned = text
    .replace(/^[•●▪◦*-]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return null;
  }

  const proficiency = extractProficiency(cleaned);

  const language = cleaned
    .replace(
      /\s*(?:[-–—:|()])\s*(?:native|fluent|advanced|intermediate|basic|beginner|professional|conversational|elementary)\s*$/i,
      ""
    )
    .trim();

  if (!language) {
    return null;
  }

  return {
    name: language,
    proficiency,
  };
};

export const normalizeLanguages = (languages) => {
  return languages
    .map(normalizeLanguage)
    .filter(Boolean);
};