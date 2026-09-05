import mongoose from "mongoose";
import Candidate from "../../models/Candidate.js";

const validateId = (candidateId) => {
  if (!candidateId) {
    throw new Error("Candidate ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(candidateId)) {
    throw new Error("Invalid Candidate ID");
  }
};

const validateUserId = (userId) => {
  if (!userId) {
    throw new Error("Authenticated user is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid authenticated user ID");
  }
};

/*
 * ------------------------------------------------
 * Create Candidate
 * ------------------------------------------------
 */

export const createCandidate = async (
  candidateData,
  createdBy,
) => {
  if (!candidateData || typeof candidateData !== "object") {
    throw new Error("Candidate data is required");
  }

  validateUserId(createdBy);

  return Candidate.create({
    ...candidateData,
    createdBy,
  });
};

/*
 * ------------------------------------------------
 * Get Candidates
 * ------------------------------------------------
 */

export const getCandidates = async ({
  status,
  email,
  createdBy,
} = {}) => {
  validateUserId(createdBy);

  const filter = {
    createdBy,
  };

  if (status) {
    filter.status = status;
  }

  if (email) {
    filter.email = email.toLowerCase();
  }

  return Candidate.find(filter)
    .sort({
      createdAt: -1,
    })
    .lean();
};

/*
 * ------------------------------------------------
 * Get Candidate By ID
 * ------------------------------------------------
 */

export const getCandidateById = async (
  candidateId,
  createdBy,
) => {
  validateId(candidateId);
  validateUserId(createdBy);

  return Candidate.findOne({
    _id: candidateId,
    createdBy,
  }).lean();
};

/*
 * ------------------------------------------------
 * Update Candidate
 * ------------------------------------------------
 */

export const updateCandidate = async (
  candidateId,
  updateData,
  createdBy,
) => {
  validateId(candidateId);
  validateUserId(createdBy);

  if (!updateData || typeof updateData !== "object") {
    throw new Error("Candidate update data is required");
  }

  /*
   * Never allow the client to change ownership.
   */
  const safeUpdateData = {
    ...updateData,
  };

  delete safeUpdateData.createdBy;

  return Candidate.findOneAndUpdate(
    {
      _id: candidateId,
      createdBy,
    },
    safeUpdateData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).lean();
};

/*
 * ------------------------------------------------
 * Delete Candidate
 * ------------------------------------------------
 */

export const deleteCandidate = async (
  candidateId,
  createdBy,
) => {
  validateId(candidateId);
  validateUserId(createdBy);

  return Candidate.findOneAndDelete({
    _id: candidateId,
    createdBy,
  }).lean();
};

/*
 * ------------------------------------------------
 * Create or Update Candidate from Processed Resume
 * ------------------------------------------------
 *
 * This is intentionally NOT ownership-filtered through
 * the HR request because this function is part of the
 * resume processing pipeline.
 * ------------------------------------------------
 */

export const syncCandidateFromResume = async ({
  resume,
  parsedResume,
}) => {
  if (!resume) {
    throw new Error("Resume is required");
  }

  if (!parsedResume || typeof parsedResume !== "object") {
    throw new Error("Parsed resume is required");
  }

  if (!resume._id) {
    throw new Error("Resume ID is required");
  }

  const personalInfo =
    parsedResume.personalInfo || {};

  const name =
    personalInfo.name?.trim() ||
    resume.originalName ||
    "Unknown Candidate";

  const email =
    personalInfo.email?.trim().toLowerCase() ||
    null;

  const phone =
    personalInfo.phone?.trim() ||
    null;

  const location =
    personalInfo.location?.trim() ||
    null;

  const skills = Array.isArray(
    parsedResume.skills,
  )
    ? parsedResume.skills
    : [];

  const experience = Array.isArray(
    parsedResume.experience,
  )
    ? parsedResume.experience
    : [];

  const education = Array.isArray(
    parsedResume.education,
  )
    ? parsedResume.education
    : [];

  const candidateData = {
    name,
    email,
    phone,
    location,
    resume: resume._id,
    skills,
    experience,
    education,
    status: "active",
    createdBy: resume.uploadedBy || null,
  };

  /*
   * One resume represents one candidate.
   */

  const existingCandidate =
    await Candidate.findOne({
      resume: resume._id,
    });

  if (existingCandidate) {
    Object.assign(
      existingCandidate,
      candidateData,
    );

    return existingCandidate.save();
  }

  return Candidate.create(
    candidateData,
  );
};