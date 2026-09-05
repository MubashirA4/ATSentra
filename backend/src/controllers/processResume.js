import Resume from "../models/Resume.js";
import AppError from "../utils/AppError.js";
import { processResume } from "../services/resume-processing.js";

export const processResumeController = async (req, res) => {
  const resume = await Resume.findById(req.params.id).select(
    "userId uploadedBy",
  );

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  const userId = req.user.userId;
  const role = req.user.role;

  const isCandidateOwner =
    resume.userId &&
    resume.userId.toString() === userId &&
    role === "candidate";

  const isRecruiterUploader =
    ["recruiter", "admin"].includes(role) &&
    resume.uploadedBy &&
    resume.uploadedBy.toString() === userId;

  if (!isCandidateOwner && !isRecruiterUploader) {
    throw new AppError("You are not authorized to process this resume", 403);
  }

  const result = await processResume({
    resumeId: resume._id,
  });

  return res.status(200).json({
    success: true,
    message: "Resume processed successfully",
    data: {
      resume: result.resume,
      resumeContent: result.resumeContent,
      candidate: result.candidate,
    },
  });
};
