import mongoose from "mongoose";

const candidateJobMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    /*
     * Identifies the exact combination of:
     * candidate + resume version + job description.
     *
     * This prevents duplicate analyses.
     */
    fingerprint: {
      type: String,
      required: true,
    },

    /*
     * Original JD entered by the candidate.
     */
    jobDescription: {
      type: String,
      required: true,
    },

    /*
     * Snapshot of the parsed job.
     *
     * We store this so historical results remain reproducible
     * even if the JD parser changes later.
     */
    job: {
      title: {
        type: String,
        default: null,
      },

      company: {
        type: String,
        default: null,
      },

      location: {
        type: String,
        default: null,
      },

      employmentType: {
        type: String,
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
        type: mongoose.Schema.Types.Mixed,
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
    },

    /*
     * Complete ATS matching result.
     */
    match: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    /*
     * Candidate-focused recommendations.
     */
    recommendations: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    /*
     * Useful for knowing which resume parser version
     * produced the analysis.
     */
    parserVersion: {
      type: String,
      default: "1.0.0",
    },
  },
  {
    timestamps: true,
  },
);

/*
 * One candidate cannot have two analyses for the
 * exact same resume version + JD combination.
 */
candidateJobMatchSchema.index(
  {
    userId: 1,
    fingerprint: 1,
  },
  {
    unique: true,
  },
);

candidateJobMatchSchema.index({
  userId: 1,
  createdAt: -1,
});

candidateJobMatchSchema.index({
  resumeId: 1,
  createdAt: -1,
});

export default mongoose.model(
  "CandidateJobMatch",
  candidateJobMatchSchema,
);