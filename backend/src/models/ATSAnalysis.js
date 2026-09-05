import mongoose from "mongoose";

const matchBreakdownSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    weight: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const matchSkillsSchema = new mongoose.Schema(
  {
    matchedRequiredSkills: {
      type: [String],
      default: [],
    },

    missingRequiredSkills: {
      type: [String],
      default: [],
    },

    matchedPreferredSkills: {
      type: [String],
      default: [],
    },

    missingPreferredSkills: {
      type: [String],
      default: [],
    },

    requiredMatchPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    preferredMatchPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const matchExperienceSchema = new mongoose.Schema(
  {
    requiredYears: {
      type: Number,
      min: 0,
      default: 0,
    },

    candidateYears: {
      type: Number,
      min: 0,
      default: 0,
    },

    matched: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const matchEducationSchema = new mongoose.Schema(
  {
    matched: {
      type: Boolean,
      default: false,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    matchedRequirements: {
      type: [String],
      default: [],
    },

    missingRequirements: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const matchCertificationsSchema = new mongoose.Schema(
  {
    required: {
      type: Number,
      min: 0,
      default: 0,
    },

    exactMatches: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    partialMatches: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    missing: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },

    matchPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },

    details: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const matchResultSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    maxScore: {
      type: Number,
      min: 0,
      required: true,
    },

    breakdown: {
      requiredSkills: matchBreakdownSchema,
      preferredSkills: matchBreakdownSchema,
      experience: matchBreakdownSchema,
      education: matchBreakdownSchema,
    },

    skills: matchSkillsSchema,

    experience: matchExperienceSchema,

    education: matchEducationSchema,
    certifications: matchCertificationsSchema,
  },
  {
    _id: false,
  },
);

const explanationSchema = new mongoose.Schema(
  {
    summary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    matchedRequiredSkills: {
      type: [String],
      default: [],
    },

    missingRequirements: {
      type: [String],
      default: [],
    },

    reasons: {
      type: [String],
      default: [],
    },

    matchedPreferredSkills: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const rankingComparisonSchema = new mongoose.Schema(
  {
    factor: {
      type: String,
      default: null,
    },

    summary: {
      type: String,
      default: "",
    },

    metrics: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    details: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const atsAnalysisSchema = new mongoose.Schema(
  {
    analysisRunId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ATSAnalysisRun",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    candidate: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: false,
      },

      name: {
        type: String,
        trim: true,
        default: null,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
      },

      location: {
        type: String,
        trim: true,
        default: null,
      },
    },

    matchResult: {
      type: matchResultSchema,
      required: true,
    },

    rankingScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    eligible: {
      type: Boolean,
      required: true,
    },

    eligibilityReasons: {
      type: [String],
      default: [],
    },

    explanation: {
      type: explanationSchema,
      required: true,
    },

    rank: {
      type: Number,
      min: 1,
      default: null,
    },

    rankingComparison: {
      type: rankingComparisonSchema,
      default: null,
    },

    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  },
);

atsAnalysisSchema.index({
  analysisRunId: 1,
  candidateId: 1,
  unique: true,
});

atsAnalysisSchema.index({
  analysisRunId: 1,
  rank: 1,
});

atsAnalysisSchema.index({
  jobId: 1,
});

atsAnalysisSchema.index({
  candidateId: 1,
});

export default mongoose.model("ATSAnalysis", atsAnalysisSchema);
