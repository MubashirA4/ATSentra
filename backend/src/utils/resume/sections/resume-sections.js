import { RESUME_SECTION_ALIASES } from "../../documents/sectionAliases.js";

export const normalizeHeading = (line) => {
  return line
    .trim()
    .replace(/[:\-|–—]+$/, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
};
 
const isGenericSkillsHeading = (line) => {
  const normalized = normalizeHeading(line);

  if (!/\bskills?\b$/i.test(normalized)) {
    return false;
  }

  const words = normalized.split(/\s+/);

  // Prevent long sentences from being treated as headings
  if (words.length > 4) {
    return false;
  }

  return true;
};

export const detectSection = (line, sectionAliases) => {
  if (!line || !sectionAliases) {
    return null;
  }

  const normalizedLine = normalizeHeading(line);

  for (const [section, aliases] of Object.entries(sectionAliases)) {
    if (aliases.includes(normalizedLine)) {
      return section;
    }
  }

  if (isGenericSkillsHeading(normalizedLine)) {
    return "skills";
  }

  return null;
};

export const parseSections = (text, sectionAliases) => {
  if (!text || typeof text !== "string") {
    return {};
  }

  if (!sectionAliases) {
    return {};
  }

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = {};

  let currentSection = null;

  for (const line of lines) {
    const detectedSection = detectSection(line, sectionAliases);

    if (detectedSection) {
      currentSection = detectedSection;

      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }

      continue;
    }

    if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  return sections;
};
