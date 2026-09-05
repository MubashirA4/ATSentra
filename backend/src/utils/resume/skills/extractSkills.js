import {
  normalizeSkills,
  getSkillAliases,
} from "./normalize.js";

import { deduplicateSkills } from "./deduplicate.js";
import { validateSkills } from "./validate.js";
import { CATEGORY_MAP } from "./category.js";

const getKnownSkills = () => {
  return Object.values(CATEGORY_MAP).flat();
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const extractSkills = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }

  const text = lines.join(" ");

  const canonicalSkills = getKnownSkills();

  const aliases = getSkillAliases();

  const skillPatterns = [
    ...canonicalSkills.map((skill) => ({
      value: skill,
      canonical: skill,
    })),

    ...aliases.map(({ alias, canonical }) => ({
      value: alias,
      canonical,
    })),
  ];

  const detectedSkills = [];

  for (const { value, canonical } of skillPatterns) {
    const pattern = new RegExp(
      `(?<![A-Za-z0-9])${escapeRegex(value)}(?![A-Za-z0-9])`,
      "i",
    );

    if (pattern.test(text)) {
      detectedSkills.push(canonical);
    }
  }

  const normalizedSkills = normalizeSkills(detectedSkills);

  const uniqueSkills = deduplicateSkills(normalizedSkills);

  const validation = validateSkills(uniqueSkills);

  if (!validation.valid) {
    return [];
  }

  return uniqueSkills;
};