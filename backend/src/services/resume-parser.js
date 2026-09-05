import { parseCertifications } from "../utils/resume/certifications/parseCertifications.js";
import { parseEducation } from "../utils/resume/education/parseEducation.js";
import { parseExperience } from "../utils/resume/experience/index.js";
import { reconstructLines } from "../utils/documents/line-reconstruction.js";
import { parseInterests } from "../utils/resume/interests/parseInterests.js";
import { parseLanguages } from "../utils/resume/language/parseLanguages.js";
import { extractPersonalInfo } from "../utils/resume/personal/resume-personal-info.js";
import { parseProjects } from "../utils/resume/project/parseProjects.js";
import { parseSections } from "../utils/documents/sections/document-sections.js";
import { parseSkills } from "../utils/resume/skills/parse.js";
import { parseSummary } from "../utils/resume/summary/parseSummary.js";
import { prepareDocument } from "../utils/documents/prepareDocument.js";
import { RESUME_SECTION_ALIASES } from "../utils/documents/sectionAliases.js";

export const parseResume = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Resume text is required");
  }

  const { reconstructedLines, reconstructedText } = prepareDocument(text);
  const sections = parseSections(reconstructedText, RESUME_SECTION_ALIASES);
 
  const personalInfo = extractPersonalInfo(text);

  return {
    personalInfo,
    summary: parseSummary(sections.summary),
    skills: parseSkills(sections.skills || []),
    experience: parseExperience(sections.experience || []),
    education: parseEducation(sections.education || []),
    projects: parseProjects(reconstructedLines),
    certifications: parseCertifications(sections.certifications || []),
    languages: parseLanguages(reconstructedLines),
    interests: parseInterests(reconstructedLines),
  };
};
