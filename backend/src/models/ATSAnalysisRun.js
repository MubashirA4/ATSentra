import mongoose from "mongoose";

const atsAnalysisRunSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    candidateCount: {
      type: Number,
      min: 0,
      required: true,
    },

    status: {
      type: String,
      enum: ["running", "completed", "failed"],
      default: "running",
    },

    completedAt: {
      type: Date,
      default: null,
    },

    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

atsAnalysisRunSchema.index({
  createdBy: 1,
  createdAt: -1,
});

atsAnalysisRunSchema.index({
  jobId: 1,
  createdAt: -1,
});

export default mongoose.model(
  "ATSAnalysisRun",
  atsAnalysisRunSchema,
);