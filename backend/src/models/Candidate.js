import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    location: {
      type: String,
      trim: true,
      default: null,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: Array,
      default: [],
    },

    education: {
      type: Array,
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

candidateSchema.index({
  email: 1,
});

candidateSchema.index({
  status: 1,
});

candidateSchema.index({
  createdBy: 1,
});

export default mongoose.model("Candidate", candidateSchema);
candidateSchema.index(
  { resume: 1 },
  {
    unique: true,
    sparse: true,
  },
);
