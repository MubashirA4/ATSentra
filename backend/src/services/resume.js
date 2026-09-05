import Resume from "../models/Resume.js";
import ResumeContent from "../models/ResumeContent.js";
import AppError from "../utils/AppError.js";
import { deleteFile } from "../utils/file.js";
import Candidate from "../models/Candidate.js";

export const createResume = async ({
  userId = null,
  uploadedBy,
  file,
}) => {
  if (!uploadedBy) {
    throw new AppError(
      "Uploader ID is required",
      400,
    );
  }

  if (!file) {
    throw new AppError(
      "Resume file is required",
      400,
    );
  }

  if (!file.originalname) {
    throw new AppError(
      "Resume original name is required",
      400,
    );
  }

  if (!file.filename) {
    throw new AppError(
      "Resume filename is required",
      400,
    );
  }

  if (!file.path) {
    throw new AppError(
      "Resume file path is required",
      400,
    );
  }

  if (!file.mimetype) {
    throw new AppError(
      "Resume MIME type is required",
      400,
    );
  }

  if (
    !Number.isFinite(file.size) ||
    file.size <= 0
  ) {
    throw new AppError(
      "Resume file size is invalid",
      400,
    );
  }

  return Resume.create({
    userId,
    uploadedBy,

    originalName: file.originalname,

    fileName: file.filename,

    filePath: file.path,

    mimeType: file.mimetype,

    fileSize: file.size,

    status: "uploaded",
  });
};

export const getUserResumes = async (userId) => {
  const resumes = await Resume.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .select("-__v");

  return resumes;
};

export const getResumeById = async ({ resumeId, userId }) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    userId,
  }).select("-__v");

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  return resume;
};

export const deleteResume = async ({
  resumeId,
  userId,
  role,
}) => {
  console.log("========== DELETE RESUME DEBUG ==========");
  console.log("resumeId:", resumeId);
  console.log("userId:", userId);
  console.log("role:", role);
  const filter = {
    _id: resumeId,
  };

  if (role === "recruiter") {
    filter.uploadedBy = userId;
  } else if (role === "admin") {
    // Admin can delete the resume by ID.
  } else {
    filter.userId = userId;
  }

  const resume = await Resume.findOne(
    filter,
  );

  if (!resume) {
    throw new AppError(
      "Resume not found",
      404,
    );
  }

  await ResumeContent.deleteOne({
    resumeId: resume._id,
  });

  await Resume.deleteOne({
    _id: resume._id,
  });

  await deleteFile(resume.filePath);

  return resume;
};

export const getResumeAnalysisById = async ({ resumeId, userId }) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    userId,
  }).select("-__v");

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  const resumeContent = await ResumeContent.findOne({
    resumeId: resume._id,
  }).select("-__v");

  if (!resumeContent) {
    throw new AppError("Resume has not been processed yet", 404);
  }

  return {
    resume,
    resumeContent,
  };
};


// Recruiter
// Recruiter Controller

export const getRecruiterResumePool = async (
  recruiterId,
) => {
  const resumes = await Resume.find({
    uploadedBy: recruiterId,
  })
    .sort({ createdAt: -1 })
    .select("-__v")
    .lean();

  if (resumes.length === 0) {
    return [];
  }

  const resumeIds = resumes.map(
    (resume) => resume._id,
  );

  const candidates = await Candidate.find({
    resume: {
      $in: resumeIds,
    },
  })
    .select("_id resume")
    .lean();

  const candidateByResumeId = new Map(
    candidates.map((candidate) => [
      String(candidate.resume),
      String(candidate._id),
    ]),
  );

  return resumes.map((resume) => ({
    ...resume,
    candidateId:
      candidateByResumeId.get(
        String(resume._id),
      ) ?? null,
  }));
};

export const getRecruiterResumeDetails = async ({
  resumeId,
  userId,
}) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    uploadedBy: userId,
  })
    .select("-__v")
    .lean();

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  const resumeContent = await ResumeContent.findOne({
    resumeId: resume._id,
  })
    .select("-__v")
    .lean();

  if (!resumeContent) {
    throw new AppError("Resume has not been processed yet", 404);
  }

  return {
    resume,
    resumeContent,
  };
};