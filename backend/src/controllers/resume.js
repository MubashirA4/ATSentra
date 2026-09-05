import {
  createResume,
  deleteResume,
  getResumeById,
  getUserResumes,
  getResumeAnalysisById,
  getRecruiterResumePool,
} from "../services/resume.js";
import AppError from "../utils/AppError.js";
import { deleteFile } from "../utils/file.js";

export const uploadResume = async (req, res) => {
  if (!req.file) {
    throw new AppError("Resume File is Required", 400);
  }

  try {
    const resume = await createResume({
      userId: req.user.userId,
      uploadedBy: req.user.userId,
      file: req.file,
    });

    return res.status(201).json({
      success: true,
      message: "Resume Uploaded Successfully",
      data: {
        resume,
      },
    });
  } catch (error) {
    // MongoDB persistence failed after multer
    // already stored the physical file.
    await deleteFile(req.file.path);

    throw error;
  }
};

export const getResumes = async (req, res) => {
  const resumes = await getUserResumes(req.user.userId);

  res.status(200).json({
    success: true,
    data: {
      resumes,
    },
  });
};

export const getResume = async (req, res) => {
  const resume = await getResumeById({
    resumeId: req.params.id,
    userId: req.user.userId,
  });

  res.status(200).json({
    success: true,
    data: {
      resume,
    },
  });
};

export const removeResume = async (
  req,
  res,
) => {
  await deleteResume({
    resumeId: req.params.id,
    userId: req.user.userId,
    role: req.user.role,
  });

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully",
  });
};

export const getResumeAnalysis = async (req, res) => {
  const result = await getResumeAnalysisById({
    resumeId: req.params.id,
    userId: req.user.userId,
  });

  res.status(200).json({
    success: true,
    data: {
      resume: result.resume,
      resumeContent: result.resumeContent,
    },
  });
};


// Recruiter Resume 

export const getRecruiterResumes = async (
  req,
  res,
) => {
  const resumes = await getRecruiterResumePool(
    req.user.userId,
  );

  return res.status(200).json({
    success: true,
    data: {
      resumes,
    },
  });
};