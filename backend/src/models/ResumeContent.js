import mongoose from "mongoose";

const resumeContentSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      unique: true,
      index: true,
    },

    extractedText: {
      type: String,
      required: true,
    },
    normalizedText: {
      type: String,
      default: "",
    },
    parserVersion: {
      type: String,
      default: "1.0.0",
    },
    parsedResume: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    qualityAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const ResumeContent = mongoose.model("ResumeContent", resumeContentSchema);

export default ResumeContent;
