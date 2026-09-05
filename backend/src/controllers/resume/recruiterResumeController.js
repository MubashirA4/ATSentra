import {
  createResume,
  getRecruiterResumeDetails,
} from "../../services/resume.js";

import AppError from "../../utils/AppError.js";
import { deleteFile } from "../../utils/file.js";

export const uploadRecruiterResume = async (req, res) => {
  if (!req.file) {
    throw new AppError("Resume file is required", 400);
  }

  try {
    const resume = await createResume({
      userId: null,
      uploadedBy: req.user.userId,
      file: req.file,
    });

    return res.status(201).json({
      success: true,
      message: "Candidate resume uploaded successfully",
      data: { resume },
    });
  } catch (error) {
    await deleteFile(req.file.path);
    throw error;
  }
};

export const getRecruiterResumeDetailsController = async (req, res) => {
  const result = await getRecruiterResumeDetails({
    resumeId: req.params.id,
    userId: req.user.userId,
  });

  return res.status(200).json({
    success: true,
    data: result,
  });
};