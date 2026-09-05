import { RESUME_SECTION_ALIASES } from "../../documents/sectionAliases.js";
import { normalizeHeading } from "../../documents/sections/document-sections.js";

const SKILLS_SECTION_HEADINGS = [
  "skills",
  "technical skills",
  "core skills",
  "key skills",
  "professional skills",
  "technical competencies",
  "core competencies",
  "competencies",
  "areas of expertise",
  "expertise",
  "technologies",
  "technical proficiencies",
];





export const isSkillsSectionHeading = (line) => {
  if (!line) return false;

  const normalized = normalizeHeading(line);

  return SKILLS_SECTION_HEADINGS.includes(normalized);
};

export const isLikelySectionHeading = (line) => {
  if (!line) return false;

  const normalized = normalizeHeading(line);

  return RESUME_SECTION_ALIASES.includes(normalized);
};

export const detectSkillsSection = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return null;
  }

  const startIndex = lines.findIndex(isSkillsSectionHeading);

  if (startIndex === -1) {
    return null;
  }

  let endIndex = lines.length;

  for (let i = startIndex + 1; i < lines.length; i++) {
    if (isLikelySectionHeading(lines[i])) {
      endIndex = i;
      break;
    }
  }

  return {
    title: lines[startIndex].trim(),
    startIndex,
    endIndex,
    lines: lines
      .slice(startIndex + 1, endIndex)
      .map((line) => line.trim())
      .filter(Boolean),
  };
};