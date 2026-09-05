import { extractDegree, isDegreeLine } from "./degree.js";

import { extractInstitution, isInstitutionLine } from "./institution.js";

import { extractEducationDate } from "./date.js";

import {
  extractEducationLocation,
  extractInstitutionWithoutLocation,
} from "./location.js";

const cleanEducationLine = (line) => {
  if (!line || typeof line !== "string") {
    return "";
  }

  return line
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^[•●▪◦○*-]\s*/, "")
    .trim();
};

const DATE_PATTERN = /\b\d{4}\s*(?:-|–|—|to)\s*(?:\d{4}|present|current)\b/gi;

const removeDates = (text) => {
  return text.replace(DATE_PATTERN, "").replace(/\s+/g, " ").trim();
};

const splitDegreeInstitution = (line) => {
  const withoutDate = removeDates(line);

  const parts = withoutDate
    .split(/\s+[—–-]\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    const possibleInstitution = parts.slice(1).join(" — ");

    if (isInstitutionLine(possibleInstitution)) {
      return {
        degree: parts[0],
        institution: possibleInstitution,
      };
    }
  }

  return {
    degree: null,
    institution: null,
  };
};

export const parseEducationEntry = (entry) => {
  if (!entry) {
    return null;
  }

  const lines = Array.isArray(entry)
    ? entry.map(cleanEducationLine).filter(Boolean)
    : [cleanEducationLine(entry)].filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  /*
   * --------------------------------------------------
   * STEP 1 — DATE
   * --------------------------------------------------
   */

  const date = extractEducationDate(lines);

  /*
   * --------------------------------------------------
   * STEP 2 — COMPACT DEGREE + INSTITUTION
   * --------------------------------------------------
   */

  let degree = null;
  let institution = null;

  for (const line of lines) {
    const split = splitDegreeInstitution(line);

    if (split.degree && isDegreeLine(split.degree)) {
      degree = split.degree;
      institution = split.institution;
      break;
    }
  }

  /*
   * --------------------------------------------------
   * STEP 3 — MULTI-LINE FORMAT
   *
   * Bachelor of Science
   * University of Karachi
   * Karachi, Pakistan
   * 2018 - 2022
   * --------------------------------------------------
   */

  if (!degree) {
    for (const line of lines) {
      if (isDegreeLine(line)) {
        degree = extractDegree(line);
        break;
      }
    }
  }

 if (!institution) {
  for (const line of lines) {
    if (isInstitutionLine(line)) {
      institution = extractInstitution(line);
      break;
    }
  }
}
 /*
   * --------------------------------------------------
   * STEP 4 — LOCATION
   * --------------------------------------------------
   *
   * Only look for an independent location line.
   */

  const location = extractEducationLocation(lines);

  /*
   * --------------------------------------------------
   * STEP 5 — STRUCTURED RESULT
   * --------------------------------------------------
   */
if (institution && location) {
  institution = extractInstitutionWithoutLocation(
    institution,
    location,
  );
}

 

  return {
    degree: degree || null,
    institution: institution || null,
    location: location || null,
    startDate: date.startDate,
    endDate: date.endDate,
    isCurrent: date.isCurrent,
  };
};

const isDegreeStart = (line) => {
  return isDegreeLine(cleanEducationLine(line));
};

const groupEducationEntries = (lines) => {
  const groups = [];

  let currentGroup = [];
  let pendingLines = [];

  for (let i = 0; i < lines.length; i++) {
    const cleanedLine = cleanEducationLine(lines[i]);

    if (!cleanedLine) {
      continue;
    }

    const startsNewDegree = isDegreeStart(cleanedLine);

    // --------------------------------------------------
    // A new degree starts here
    // --------------------------------------------------
    if (startsNewDegree) {
      const currentHasDegree = currentGroup.some((item) =>
        isDegreeStart(item)
      );

      if (currentHasDegree) {
        groups.push(currentGroup);
        currentGroup = [];
      }

      // Attach lines that appeared before the degree.
      if (pendingLines.length > 0) {
        currentGroup.push(...pendingLines);
        pendingLines = [];
      }

      currentGroup.push(cleanedLine);
      continue;
    }

    // --------------------------------------------------
    // If we have a degree already, check whether this
    // institution belongs to the NEXT degree.
    // --------------------------------------------------
    const currentHasDegree = currentGroup.some((item) =>
      isDegreeStart(item)
    );

    const nextLine = lines[i + 1]
      ? cleanEducationLine(lines[i + 1])
      : "";

    const nextLineStartsNewDegree =
      nextLine && isDegreeStart(nextLine);

    if (
      currentHasDegree &&
      isInstitutionLine(cleanedLine) &&
      nextLineStartsNewDegree
    ) {
      groups.push(currentGroup);
      currentGroup = [cleanedLine];
      continue;
    }

    // --------------------------------------------------
    // Before the first degree, hold metadata lines.
    // --------------------------------------------------
    if (currentGroup.length === 0) {
      pendingLines.push(cleanedLine);
      continue;
    }

    currentGroup.push(cleanedLine);
  }

  // --------------------------------------------------
  // Save final group
  // --------------------------------------------------
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  // --------------------------------------------------
  // Preserve anything that was never attached
  // --------------------------------------------------
  if (pendingLines.length > 0) {
    groups.push(pendingLines);
  }

  return groups;
};

export const parseEducation = (education) => {
  if (!Array.isArray(education)) {
    return [];
  }

  const lines = education.map(cleanEducationLine).filter(Boolean);


  const groups = groupEducationEntries(lines);

  

  return groups.map(parseEducationEntry).filter(Boolean);
};
