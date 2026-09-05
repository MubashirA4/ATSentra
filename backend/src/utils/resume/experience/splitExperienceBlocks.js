import { cleanLine } from "../../shared/textUtils.js";
import {
  isDateRange,
  extractDateRange,
} from "./experienceDate.js";

/**
 * Determine whether a line looks like a bullet point.
 */
const isBulletLine = (line) => {
  if (!line) return false;

  return /^[•●▪◦○\-–—]\s+/.test(line.trim());
};

/**
 * Determine whether a line is likely to be
 * the beginning of a new experience.
 */
const looksLikeExperienceHeader = (line) => {
  if (!line) return false;

  const cleanedLine = cleanLine(line);

  if (isDateRange(cleanedLine)) return false;

  if (isBulletLine(line)) return false;

  if (cleanedLine.length > 120) return false;

  if (/^--?\s*\d+\s+of\s+\d+\s*--?$/i.test(cleanedLine)) {
    return false;
  }

  const excludedHeadings = [
    "experience",
    "work experience",
    "professional experience",
    "employment history",
    "work history",
  ];

  if (excludedHeadings.includes(cleanedLine.toLowerCase())) {
    return false;
  }

  return true;
};

export const splitExperienceBlocks = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }

  const cleanedLines = lines
    .map(cleanLine)
    .filter(Boolean);

  const blocks = [];
  let currentBlock = [];
  let foundDateForCurrentBlock = false;

  for (let i = 0; i < cleanedLines.length; i++) {
    const line = cleanedLines[i];

    const standaloneDate = isDateRange(line);
    const embeddedDate = extractDateRange(line);

    /**
     * --------------------------------------------------
     * Case 1: Standalone date
     *
     * Example:
     *
     * Senior Software Engineer — TechNova
     * January 2024 – Present
     * --------------------------------------------------
     */
    if (standaloneDate) {
      currentBlock.push(line);
      foundDateForCurrentBlock = true;
      continue;
    }

    /**
     * --------------------------------------------------
     * Case 2: Embedded date
     *
     * Example:
     *
     * Machine Learning Engineer March 2023 – Present
     * --------------------------------------------------
     */
    if (embeddedDate) {
      /**
       * If we already have a completed experience,
       * this embedded date indicates a new experience.
       */
      if (currentBlock.length > 0 && foundDateForCurrentBlock) {
        blocks.push(currentBlock);

        currentBlock = [];
        foundDateForCurrentBlock = false;
      }

      currentBlock.push(line);
      foundDateForCurrentBlock = true;

      continue;
    }

    /**
     * --------------------------------------------------
     * Case 3: New header followed by standalone date
     *
     * Example:
     *
     * Data Analyst — Insight Analytics
     * July 2021 – February 2023
     * --------------------------------------------------
     */
    if (
      foundDateForCurrentBlock &&
      looksLikeExperienceHeader(line)
    ) {
      const nextLine = cleanedLines[i + 1];
      const nextNextLine = cleanedLines[i + 2];

      const nextLineIsDate =
        nextLine && isDateRange(nextLine);

      const nextNextLineIsDate =
        nextNextLine && isDateRange(nextNextLine);

      const followedByDate =
        nextLineIsDate || nextNextLineIsDate;

      if (followedByDate) {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock);
        }

        currentBlock = [line];
        foundDateForCurrentBlock = false;

        continue;
      }
    }

    currentBlock.push(line);
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks;
};