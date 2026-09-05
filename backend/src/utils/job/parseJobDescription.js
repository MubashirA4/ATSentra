import { extractJobSkills } from "./skills.js";
import { parseSections } from "../documents/sections/document-sections.js";
import {
  extractJobCertifications,
  isCertificationLine,
} from "./certifications.js";
import { extractCompany } from "./company.js";
import { extractEducationRequirements } from "./educationRequirements.js";
import { extractExperienceRequirement } from "./experienceRequirement.js";
import { extractJobLocation } from "./location.js";
import { extractJobTitle } from "./jobTitle.js";
import { extractResponsibilities } from "./responsibilities.js";
import { validateJobDescription } from "./validateJobDescription.js";
import { prepareDocument } from "../documents/prepareDocument.js";
import { JOB_SECTION_ALIASES } from "../documents/sectionAliases.js";
import { extractEmploymentType } from "../shared/employmentType.js";

export const parseJobDescription = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Job description text is required");
  }

  const { reconstructedLines, reconstructedText } = prepareDocument(text);

  const sections = parseSections(reconstructedText, JOB_SECTION_ALIASES);

  const requiredSkillLines =
    sections.requirements?.length > 0
      ? sections.requirements
      : sections.skills || [];

  const requiredCertificationLines = (sections.requirements || []).filter(
    isCertificationLine,
  );

  const preferredCertificationLines = (sections.preferred || []).filter(
    isCertificationLine,
  );

  const dedicatedCertificationLines = sections.certifications || [];

  const certifications = extractJobCertifications([
    ...requiredCertificationLines,
    ...preferredCertificationLines,
    ...dedicatedCertificationLines,
  ]);

  const requiredSkills = extractJobSkills(
    (sections.requirements || []).filter((line) => !isCertificationLine(line)),
  );

  const preferredSkills = extractJobSkills(
    (sections.preferred || []).filter((line) => !isCertificationLine(line)),
  );

  const responsibilities = extractResponsibilities(
    sections.responsibilities || [],
  );

  const educationRequirements = extractEducationRequirements(
    sections.education || sections.requirements || [],
  );

  const experienceLines = [
    ...(sections.experience || []),
    ...(sections.requirements || []),
  ];

  const experienceRequirement = extractExperienceRequirement(experienceLines);

  const finalExperienceRequirement =
    experienceRequirement || extractExperienceRequirement(reconstructedLines);

  // Build the actual parsed JD
  const result = {
    jobTitle: extractJobTitle(reconstructedLines),

    company: extractCompany(reconstructedLines),

    location: extractJobLocation(reconstructedLines),

    employmentType: extractEmploymentType({
      block: reconstructedLines,
    }),

    requiredSkills,

    preferredSkills,
    certifications,

    experienceRequirement: finalExperienceRequirement,

    educationRequirements,

    responsibilities,
  };

  // Validate the parsed JD
  const validation = validateJobDescription(result);

  return {
    ...result,
    validation,
  };
};
