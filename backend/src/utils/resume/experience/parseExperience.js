import { extractEmploymentType } from "../../shared/employmentType.js";
import { isLikelyAchievement } from "../../shared/isLikelyAchievement.js";
import { findDateRange } from "./experienceDate.js";
import { detectAndParseExperienceHeader } from "./experienceHeader.js";
import {
  isPdfArtifact,
  normalizeExperienceText,
  uniqueLines,
} from "./experienceText.js";
import {
  extractExperienceLocation,
  extractExperienceCompany,
} from "./resume-experience-location.js";
import { splitExperienceBlocks } from "./splitExperienceBlocks.js";

export const parseExperience = (lines) => {
  const blocks = splitExperienceBlocks(lines);

  return blocks.map(parseExperienceBlock).filter(Boolean);
};

export const parseExperienceBlock = (block) => {
  if (!Array.isArray(block) || block.length === 0) {
    return null;
  }

  const { jobTitle, company, headerLines, dateIndex, dateInfo } =
    detectAndParseExperienceHeader(block);

  const dateRange = dateInfo ?? findDateRange(block);

  const location = extractExperienceLocation({
    block,
    dateIndex,
    headerLines,
  });
  const extractedCompany = extractExperienceCompany({
    block,
    dateIndex,
    headerLines,
    location,
  });

  const employmentType = extractEmploymentType({
  block,
  headerLines,
});

  let descriptionLines;

  if (dateIndex !== -1) {
    descriptionLines = block.slice(dateIndex + 1);

    // When the date is embedded in the first header line,
    // the following line can be the company/location line.
    if (headerLines.length > 0 && descriptionLines.length > 0) {
      const firstDescriptionLine = descriptionLines[0].trim();

      const isHeaderLine = headerLines.some(
        (headerLine) =>
          headerLine.trim().toLowerCase() ===
          firstDescriptionLine.toLowerCase(),
      );

      if (isHeaderLine) {
        descriptionLines = descriptionLines.slice(1);
      }
    }
  } else {
    descriptionLines = block.slice(headerLines.length);
  }

  const responsibilities = [];
  const achievements = [];

  for (const line of descriptionLines) {
    if (isPdfArtifact(line)) {
      continue;
    }

    const cleanedLine = normalizeExperienceText(line);

    if (!cleanedLine) {
      continue;
    }

    if (isLikelyAchievement(cleanedLine)) {
      achievements.push(cleanedLine);
    } else {
      responsibilities.push(cleanedLine);
    }
  }
  const uniqueResponsibilities = uniqueLines(responsibilities);

  const uniqueAchievements = uniqueLines(achievements);
  return {
    jobTitle,
    company: extractedCompany ?? company,
    location,
    startDate: dateRange?.startDate ?? null,
    endDate: dateRange?.endDate ?? null,
    isCurrent: dateRange?.isCurrent ?? false,
    employmentType,
    responsibilities: uniqueResponsibilities,
    achievements: uniqueAchievements,
  };
};
