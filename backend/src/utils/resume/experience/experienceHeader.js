import { cleanLine } from "../../shared/textUtils.js";
import { isDateRange, extractDateRange } from "./experienceDate.js";

/**
 * Split a header into job title and company.
 *
 * Supported examples:
 *
 * Senior Software Engineer — TechNova Solutions
 * Software Engineer - DigitalWorks Pakistan
 * Software Engineer | DigitalWorks Pakistan
 */
const parseJobHeader = (line) => {
  if (!line) {
    return {
      jobTitle: null,
      company: null,
    };
  }

  const cleanedLine = cleanLine(line);

  const separatorRegex = /\s+(?:—|–|-|\|)\s+/;

  const parts = cleanedLine
    .split(separatorRegex)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return {
      jobTitle: parts[0],
      company: parts.slice(1).join(" — "),
    };
  }

  return {
    jobTitle: cleanedLine,
    company: null,
  };
};

const COMPANY_KEYWORDS = [
  "inc",
  "ltd",
  "limited",
  "llc",
  "corp",
  "corporation",
  "company",
  "technologies",
  "technology",
  "solutions",
  "systems",
  "software",
  "services",
  "group",
  "labs",
  "studio",
  "consulting",
  "bank",
  "university",
  "hospital",
];

const isLikelyCompany = (line) => {
  if (!line) return false;

  const normalized = cleanLine(line).toLowerCase();

  return COMPANY_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const JOB_TITLE_KEYWORDS = [
  "engineer",
  "developer",
  "designer",
  "manager",
  "director",
  "analyst",
  "consultant",
  "architect",
  "administrator",
  "specialist",
  "coordinator",
  "lead",
  "officer",
  "intern",
  "associate",
  "executive",
  "scientist",
  "technician",
];

const isLikelyJobTitle = (line) => {
  if (!line) return false;

  const normalized = cleanLine(line).toLowerCase();

  return JOB_TITLE_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

/**
 * Detect the experience header and date position.
 *
 * Supports:
 *
 * 1. Separate date:
 *
 * Senior Software Engineer
 * TechNova Solutions
 * January 2024 – Present
 *
 * 2. Embedded date:
 *
 * Machine Learning Engineer March 2023 – Present
 * AI Labs Pakistan Lahore, Pakistan
 */
const detectExperienceHeader = (block) => {
  if (!Array.isArray(block) || block.length === 0) {
    return {
      headerLines: [],
      dateIndex: -1,
      dateInfo: null,
    };
  }

  /**
   * First look for a standalone date.
   */
  const standaloneDateIndex = block.findIndex((line) => isDateRange(line));

  if (standaloneDateIndex !== -1) {
    const possibleHeaderLines = block
      .slice(0, standaloneDateIndex)
      .map(cleanLine)
      .filter(Boolean);

    const headerLines = possibleHeaderLines.slice(-2);

    return {
      headerLines,
      dateIndex: standaloneDateIndex,
      dateInfo: null,
    };
  }

  /**
   * If there is no standalone date,
   * look for an embedded date.
   */
  const embeddedDateIndex = block.findIndex((line) => extractDateRange(line));

  if (embeddedDateIndex !== -1) {
    const line = cleanLine(block[embeddedDateIndex]);
    const dateInfo = extractDateRange(line);

    /**
     * Remove the date portion from the header.
     *
     * Example:
     *
     * Machine Learning Engineer March 2023 – Present
     *
     * becomes:
     *
     * Machine Learning Engineer
     */
    const headerWithoutDate = cleanLine(
      line.replace(dateInfo.match, "").trim(),
    );

    const previousLines = block
      .slice(0, embeddedDateIndex)
      .map(cleanLine)
      .filter(Boolean);

    const nextLine = block[embeddedDateIndex + 1];

    const nextLineCleaned = nextLine ? cleanLine(nextLine) : null;

    const headerLines = [
      ...previousLines,
      ...(headerWithoutDate ? [headerWithoutDate] : []),
      ...(nextLineCleaned ? [nextLineCleaned] : []),
    ].slice(-2);

    return {
      headerLines,
      dateIndex: embeddedDateIndex,
      dateInfo,
    };
  }

  return {
    headerLines: [],
    dateIndex: -1,
    dateInfo: null,
  };
};

const parseExperienceHeader = (headerLines) => {
  if (!Array.isArray(headerLines) || headerLines.length === 0) {
    return {
      jobTitle: null,
      company: null,
    };
  }

  /**
   * First try to parse each header line independently.
   *
   * Example:
   *
   * Senior Software Engineer — TechNova Solutions
   */
  for (const line of headerLines) {
    const parsed = parseJobHeader(line);

    if (parsed.jobTitle && parsed.company) {
      return parsed;
    }
  }

  const firstLine = headerLines[0];
  const secondLine = headerLines[1];

  /**
   * Job title followed by company.
   */
  if (
    headerLines.length >= 2 &&
    isLikelyJobTitle(firstLine) &&
    isLikelyCompany(secondLine)
  ) {
    return {
      jobTitle: firstLine,
      company: secondLine,
    };
  }

  /**
   * Company followed by job title.
   */
  if (
    headerLines.length >= 2 &&
    isLikelyCompany(firstLine) &&
    isLikelyJobTitle(secondLine)
  ) {
    return {
      jobTitle: secondLine,
      company: firstLine,
    };
  }

  /**
   * Fallback.
   */
  return {
    jobTitle: firstLine,
    company: secondLine || null,
  };
};

export const detectAndParseExperienceHeader = (block) => {
  const { headerLines, dateIndex, dateInfo } = detectExperienceHeader(block);

  if (headerLines.length === 0) {
    return {
      jobTitle: null,
      company: null,
      headerLines: [],
      dateIndex,
      dateInfo,
    };
  }

  const { jobTitle, company } = parseExperienceHeader(headerLines);

  return {
    jobTitle,
    company,
    headerLines,
    dateIndex,
    dateInfo,
  };
};
