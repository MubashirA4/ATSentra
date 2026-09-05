import {
  scoreContactInfo,
} from "../contact/scoreContactInfo.js";

import {
  scoreSummary,
} from "../summary/scoreSummary.js";

import {
  scoreSkills,
} from "../skills/scoreSkills.js";

import {
  scoreExperience,
} from "../experience/scoreExperience.js";

import {
  scoreEducation,
} from "../education/scoreEducation.js";

import {
  scoreProjects,
} from "../project/scoreProjects.js";

import {
  scoreCertifications,
} from "../certifications/scoreCertifications.js";

import {
  scoreLanguages,
} from "../language/scoreLanguages.js";

import {
  scoreAchievements,
} from "../achievements/scoreAchievements.js";

import {
  scoreStructure,
} from "../structure/scoreStructure.js";

export const scoreResume = (resume) => {
  const breakdown = {
    contact: scoreContactInfo(
      resume.personalInfo
    ),

    summary: scoreSummary(
      resume.summary
    ),

    skills: scoreSkills(
      resume.skills
    ),

    experience: scoreExperience(
      resume.experience
    ),

    education: scoreEducation(
      resume.education
    ),

    projects: scoreProjects(
      resume.projects
    ),

    certifications:
      scoreCertifications(
        resume.certifications
      ),

    languages: scoreLanguages(
      resume.languages
    ),

    achievements:
      scoreAchievements(
        resume.achievements
      ),

    structure: scoreStructure(
      resume
    ),
  };

  const totalScore = Object.values(
    breakdown
  ).reduce(
    (total, item) =>
      total + item.score,
    0
  );

  const maxScore = Object.values(
    breakdown
  ).reduce(
    (total, item) =>
      total + item.maxScore,
    0
  );

  return {
    score: totalScore,
    maxScore,
    percentage: Math.round(
      (totalScore / maxScore) * 100
    ),
    breakdown,
  };
};