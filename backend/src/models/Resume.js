import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    // The ATSentra candidate this resume belongs to.
    // Null when a recruiter uploads an external candidate's CV.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // The account that uploaded/manages this resume.
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "uploaded",
        "processing",
        "processed",
        "failed",
      ],
      default: "uploaded",
    },

    processingError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

resumeSchema.index({
  uploadedBy: 1,
  createdAt: -1,
});

export default mongoose.model("Resume", resumeSchema);