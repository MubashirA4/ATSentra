import mongoose from "mongoose";

const experienceRequirementSchema =
  new mongoose.Schema(
    {
      minYears: {
        type: Number,
        min: 0,
        default: null,
      },

      maxYears: {
        type: Number,
        min: 0,
        default: null,
      },
    },
    {
      _id: false,
    },
  );

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: null,
    },

    employmentType: {
      type: String,
      trim: true,
      default: null,
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    preferredSkills: {
      type: [String],
      default: [],
    },

    experienceRequirement: {
      type: experienceRequirementSchema,
      default: null,
    },

    educationRequirements: {
      type: [String],
      default: [],
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "open",
        "closed",
        "archived",
      ],
      default: "draft",
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

jobSchema.index({
  status: 1,
});

jobSchema.index({
  company: 1,
});

jobSchema.index({
  createdBy: 1,
});

export default mongoose.model(
  "Job",
  jobSchema,
);