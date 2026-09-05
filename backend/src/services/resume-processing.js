import Resume from "../models/Resume.js";
import ResumeContent from "../models/ResumeContent.js";
import AppError from "../utils/AppError.js";
import { analyzeResumeQuality } from "../utils/resume/Analysis/analyzeResumeQuality.js";
import { cleanResumeText } from "../utils/shared/text.js";
import { extractResumeText } from "./resume-extraction.js";
import { parseResume } from "./resume-parser.js";
import { syncCandidateFromResume } from "./candidates/candidateService.js";

export const processResume = async ({ resumeId }) => {
  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  if (resume.status === "processing") {
    throw new AppError("Resume is already being processed", 409);
  }

  try {
    resume.status = "processing";
    resume.processingError = null;

    await resume.save();

    // 1. Extract text
    const extractedText = await extractResumeText({
      filePath: resume.filePath,
      mimeType: resume.mimeType,
    });

    if (!extractedText.trim()) {
      throw new Error("No readable text found in resume");
    }

    // 2. Clean and normalize text
    const normalizedText = cleanResumeText(extractedText);

    if (!normalizedText.trim()) {
      throw new Error("Resume contains no usable text");
    }

    // 3. Parse resume
    const parsedResume = parseResume(normalizedText);
    // console.log("Parsed Resume:");
    // console.log(JSON.stringify(parsedResume, null, 2));

    // console.log("Normalized Text:");
    // console.log(normalizedText);

    const qualityAnalysis = analyzeResumeQuality(parsedResume);
    //     console.log(
    //   "RESUME QUALITY ANALYSIS:",
    //   JSON.stringify(qualityAnalysis, null, 2)
    // );
    // 4. Store processed resume content
    const resumeContent = await ResumeContent.findOneAndUpdate(
      { resumeId: resume._id },
      {
        resumeId: resume._id,
        extractedText,
        normalizedText,
        parsedResume,
        qualityAnalysis,
        parserVersion: "1.0.0",
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    const candidate = await syncCandidateFromResume({
      resume,
      parsedResume,
    });
    // 5. Mark resume as successfully processed
    resume.status = "processed";

    await resume.save();

    return {
      resume,
      resumeContent,
      candidate,
    };
  } catch (error) {
    resume.status = "failed";
    resume.processingError = error.message;

    await resume.save();

    throw error;
  }
};
