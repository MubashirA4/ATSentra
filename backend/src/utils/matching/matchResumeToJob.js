import { matchSkills } from "./skillMatcher.js";
import { matchExperience } from "./experienceMatcher.js";
import { matchEducation } from "./educationMatcher.js";
import { calculateMatchScore } from "./scoreCalculator.js";
import { validateResumeInput } from "./validateResumeInput.js";
import { validateJobInput } from "./validateJobInput.js";
import { matchCertifications } from "./certificationMatcher.js";
export const matchResumeToJob = ({ resume, job }) => {
  if (!resume || typeof resume !== "object") {
    throw new Error("Parsed resume is required");
  }

  if (!job || typeof job !== "object") {
    throw new Error("Parsed job description is required");
  }

  validateResumeInput(resume);
  validateJobInput(job);

  const skillMatch = matchSkills({
    candidateSkills: resume.skills || [],
    requiredSkills: job.requiredSkills || [],
    preferredSkills: job.preferredSkills || [],
  });

  const experienceMatch = matchExperience({
    experience: resume.experience || [],
    requirement: job.experienceRequirement,
  });

  const educationMatch = matchEducation({
    education: resume.education || [],
    requirements: job.educationRequirements || [],
  });
  const certificationMatch = matchCertifications({
    candidateCertifications: resume.certifications || [],

    requiredCertifications: job.certifications || [],
  });
  const score = calculateMatchScore({
    skillMatch,
    experienceMatch,
    educationMatch,
    certificationMatch,
  });

  return {
    score: score.score,
    maxScore: score.maxScore,
    breakdown: score.breakdown,
    skills: skillMatch,
    experience: experienceMatch,
    education: educationMatch,
    certifications: certificationMatch,
  };
};
