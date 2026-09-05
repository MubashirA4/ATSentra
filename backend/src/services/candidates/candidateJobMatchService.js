import crypto from "crypto";
import mongoose from "mongoose";

import Resume from "../../models/Resume.js";
import ResumeContent from "../../models/ResumeContent.js";
import CandidateJobMatch from "../../models/CandidateJobMatch.js";

import { parseJobDescription } from "../../utils/job/parseJobDescription.js";
import { matchResumeToJob } from "../../utils/matching/matchResumeToJob.js";

const validateId = (id, fieldName = "ID") => {
  if (!id) {
    throw new Error(`${fieldName} is required`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const validateUserId = (userId) => {
  if (!userId) {
    throw new Error("Authenticated user is required");
  }

  validateId(userId, "Authenticated user ID");
};

/*
 * Normalize the JD only for fingerprint generation.
 *
 * We keep the original JD separately in the database.
 */
const normalizeJobDescriptionForFingerprint = (
  jobDescription,
) => {
  return jobDescription
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

/*
 * Generate a deterministic fingerprint.
 *
 * Same:
 *   candidate
 *   resume
 *   resume processing version/time
 *   job description
 *
 * = same fingerprint
 *
 * Different JD or reprocessed resume
 * = different fingerprint
 */
const generateFingerprint = ({
  userId,
  resumeId,
  resumeContent,
  jobDescription,
}) => {
  const normalizedJobDescription =
    normalizeJobDescriptionForFingerprint(
      jobDescription,
    );

  const fingerprintInput = [
    userId.toString(),
    resumeId.toString(),
    resumeContent._id.toString(),
    resumeContent.parserVersion || "1.0.0",
    resumeContent.updatedAt
      ? new Date(
          resumeContent.updatedAt,
        ).toISOString()
      : "",
    normalizedJobDescription,
  ].join("|");

  return crypto
    .createHash("sha256")
    .update(fingerprintInput)
    .digest("hex");
};

const generateRecommendations = ({
  matchResult,
  parsedJob,
}) => {
  const recommendations = [];

  const {
    skills,
    experience,
    education,
  } = matchResult;

  /*
   * Required skills
   */
  for (const skill of skills.missingRequiredSkills || []) {
    recommendations.push({
      type: "required-skill",
      priority: "high",
      title: `Add ${skill} if you have relevant experience`,
      message:
        `${skill} is required for this position but was not detected in your CV. ` +
        `If you genuinely have experience with ${skill}, make it explicit in your skills, projects, or work experience.`,
    });
  }

  /*
   * Preferred skills
   */
  for (const skill of skills.missingPreferredSkills || []) {
    recommendations.push({
      type: "preferred-skill",
      priority: "medium",
      title: `Consider highlighting ${skill}`,
      message:
        `${skill} is listed as a preferred skill but was not detected in your CV. ` +
        `If you have used ${skill}, consider making that experience more visible.`,
    });
  }

  /*
   * Experience
   */
  if (
    experience.requiredYears !== null &&
    experience.candidateYears < experience.requiredYears
  ) {
    recommendations.push({
      type: "experience",
      priority: "high",
      title: "Experience requirement gap",
      message:
        `This position requires approximately ${experience.requiredYears} years ` +
        `of experience, while your CV currently shows approximately ` +
        `${experience.candidateYears} years.`,
    });
  }

  /*
   * Education
   */
  for (
    const requirement of education.missingRequirements || []
  ) {
    recommendations.push({
      type: "education",
      priority: "medium",
      title: "Education requirement not detected",
      message:
        `The job description requires ${requirement}, but this qualification ` +
        `was not detected in your CV.`,
    });
  }

  /*
   * General recommendation.
   */
  if (matchResult.score < 60) {
    recommendations.push({
      type: "general",
      priority: "high",
      title: "Improve your overall job alignment",
      message:
        "Your CV currently has a relatively low match with this job. " +
        "Focus first on accurately highlighting relevant skills and experience " +
        "that you already possess.",
    });
  } else if (matchResult.score < 80) {
    recommendations.push({
      type: "general",
      priority: "medium",
      title: "Strengthen your CV alignment",
      message:
        "Your CV has a reasonable match with this position. " +
        "Review the missing skills and experience gaps above and make relevant " +
        "experience more explicit where applicable.",
    });
  }

  void parsedJob;

  return recommendations;
};

export const matchCandidateResumeToJob = async ({
  resumeId,
  userId,
  jobDescription,
}) => {
  validateId(resumeId, "Resume ID");
  validateUserId(userId);

  if (
    !jobDescription ||
    typeof jobDescription !== "string" ||
    !jobDescription.trim()
  ) {
    throw new Error("Job description is required");
  }

  /*
   * ------------------------------------------------
   * 1. Verify resume ownership.
   * ------------------------------------------------
   */
  const resume = await Resume.findOne({
    _id: resumeId,
    userId,
  })
    .select("-__v")
    .lean();

  if (!resume) {
    throw new Error(
      "Resume not found or you do not have permission to use it",
    );
  }

  /*
   * ------------------------------------------------
   * 2. Load processed resume content.
   * ------------------------------------------------
   */
  const resumeContent = await ResumeContent.findOne({
    resumeId: resume._id,
  })
    .select("-__v")
    .lean();

  if (!resumeContent) {
    throw new Error(
      "Resume has not been processed yet",
    );
  }

  if (!resumeContent.parsedResume) {
    throw new Error(
      "Parsed resume is not available",
    );
  }

  /*
   * ------------------------------------------------
   * 3. Generate deterministic fingerprint.
   * ------------------------------------------------
   */
  const fingerprint = generateFingerprint({
    userId,
    resumeId: resume._id,
    resumeContent,
    jobDescription,
  });

  /*
   * ------------------------------------------------
   * 4. Check whether this exact analysis already
   *    exists.
   * ------------------------------------------------
   */
  const existingMatch =
    await CandidateJobMatch.findOne({
      userId,
      fingerprint,
    })
      .select("-__v")
      .lean();

  if (existingMatch) {
    return {
      cached: true,

      _id: existingMatch._id,

      resume: {
        _id: resume._id,
        originalName: resume.originalName,
        status: resume.status,
      },

      job: existingMatch.job,

      match: existingMatch.match,

      recommendations:
        existingMatch.recommendations,

      createdAt: existingMatch.createdAt,

      updatedAt: existingMatch.updatedAt,
    };
  }

  /*
   * ------------------------------------------------
   * 5. Get structured resume.
   * ------------------------------------------------
   */
  const parsedResume =
    typeof resumeContent.parsedResume === "string"
      ? JSON.parse(resumeContent.parsedResume)
      : resumeContent.parsedResume;

  /*
   * ------------------------------------------------
   * 6. Parse JD.
   * ------------------------------------------------
   */
  const parsedJob =
    parseJobDescription(
      jobDescription.trim(),
    );

  /*
   * ------------------------------------------------
   * 7. Reuse existing ATS matching engine.
   * ------------------------------------------------
   */
  const matchResult =
    matchResumeToJob({
      resume: parsedResume,
      job: parsedJob,
    });

  /*
   * ------------------------------------------------
   * 8. Generate recommendations.
   * ------------------------------------------------
   */
  const recommendations =
    generateRecommendations({
      matchResult,
      parsedJob,
    });

  /*
   * ------------------------------------------------
   * 9. Create job snapshot.
   * ------------------------------------------------
   */
  const jobSnapshot = {
    title: parsedJob.jobTitle,
    company: parsedJob.company,
    location: parsedJob.location,
    employmentType:
      parsedJob.employmentType,
    requiredSkills:
      parsedJob.requiredSkills,
    preferredSkills:
      parsedJob.preferredSkills,
    experienceRequirement:
      parsedJob.experienceRequirement,
    educationRequirements:
      parsedJob.educationRequirements,
    responsibilities:
      parsedJob.responsibilities,
  };

  /*
   * ------------------------------------------------
   * 10. Persist candidate analysis.
   * ------------------------------------------------
   */
  try {
    const savedMatch =
      await CandidateJobMatch.create({
        userId,
        resumeId: resume._id,
        fingerprint,
        jobDescription:
          jobDescription.trim(),
        job: jobSnapshot,
        match: matchResult,
        recommendations,
        parserVersion:
          resumeContent.parserVersion ||
          "1.0.0",
      });

    /*
     * ------------------------------------------------
     * 11. Return newly created analysis.
     * ------------------------------------------------
     */
    return {
      cached: false,

      _id: savedMatch._id,

      resume: {
        _id: resume._id,
        originalName: resume.originalName,
        status: resume.status,
      },

      job: jobSnapshot,

      match: matchResult,

      recommendations,

      createdAt: savedMatch.createdAt,

      updatedAt: savedMatch.updatedAt,
    };
  } catch (error) {
    /*
     * ------------------------------------------------
     * 12. Handle concurrent duplicate requests.
     *
     * If two identical requests arrive at exactly
     * the same time, MongoDB's unique index protects
     * us from duplicate documents.
     * ------------------------------------------------
     */
    if (error?.code === 11000) {
      const duplicateMatch =
        await CandidateJobMatch.findOne({
          userId,
          fingerprint,
        })
          .select("-__v")
          .lean();

      if (duplicateMatch) {
        return {
          cached: true,

          _id: duplicateMatch._id,

          resume: {
            _id: resume._id,
            originalName:
              resume.originalName,
            status: resume.status,
          },

          job: duplicateMatch.job,

          match: duplicateMatch.match,

          recommendations:
            duplicateMatch.recommendations,

          createdAt:
            duplicateMatch.createdAt,

          updatedAt:
            duplicateMatch.updatedAt,
        };
      }
    }

    throw error;
  }
};