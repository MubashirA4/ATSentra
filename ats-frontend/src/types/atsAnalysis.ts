import type { ATSCandidate } from "./atsDashboard";
import type { ATSJob } from "./job";

export interface ATSExecutionRequest {
  jobId: string;
  candidateIds: string[];
}

export interface ATSMatchBreakdownItem {
  score: number;
  weight: number;
}

export interface ATSCertificationMatch {
  required: string;
  candidate: string;
  status: "exact" | "partial";
  score: number;
}

export interface ATSCertificationResult {
  required: number;
  exactMatches: ATSCertificationMatch[];
  partialMatches: ATSCertificationMatch[];
  missing: string[];
  score: number;
  matchPercentage: number;
  details: ATSCertificationMatch[];
}

export interface ATSMatchResult {
  score: number;
  maxScore: number;

  breakdown: {
    requiredSkills: ATSMatchBreakdownItem;
    preferredSkills: ATSMatchBreakdownItem;
    experience: ATSMatchBreakdownItem;
    education: ATSMatchBreakdownItem;
    certifications: ATSMatchBreakdownItem;
  };

  skills: {
    matchedRequiredSkills: string[];
    missingRequiredSkills: string[];
    matchedPreferredSkills: string[];
    missingPreferredSkills: string[];
    requiredMatchPercentage: number;
    preferredMatchPercentage: number;
  };

  experience: {
    requiredYears: number | null;
    candidateYears: number | null;
    matched: boolean;
    score: number;
  };

  education: {
    matched: boolean;
    score: number;
    matchedRequirements: string[];
    missingRequirements: string[];
  };

  certifications: ATSCertificationResult;
}

export interface ATSExplanation {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  matchedRequiredSkills: string[];
  missingRequirements: string[];
  reasons: string[];
  matchedPreferredSkills: string[];

  certifications?: {
    score: number;
    matched: ATSCertificationMatch[];
    partial: ATSCertificationMatch[];
    missing: string[];
  };
}

export interface ATSRankingComparison {
  factor: string;
  summary: string;
  metrics: Record<string, unknown> | null;
  details: string[];
}

export interface ATSCandidateResult {
  candidateId: string;

  candidate: ATSCandidate;

  rank: number;
  rankingScore: number;
  eligible: boolean;
  eligibilityReasons: string[];
  matchResult: ATSMatchResult;
  explanation: ATSExplanation;
  rankingComparison: ATSRankingComparison;
  analysisId: string | null;
}

export interface ATSExecutionResponse {
  success: boolean;
  message: string;

  data: {
    analysisRun: ATSAnalysisHistoryRun;
    job: ATSJob;
    candidates: ATSCandidateResult[];
  };
}

export type ATSAnalysisRunStatus =
  | "running"
  | "completed"
  | "failed";

export interface ATSAnalysisRun {
  _id: string;
  jobId: string;
  createdBy: string;
  candidateCount: number;
  status: ATSAnalysisRunStatus;
  completedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ATSAnalysisHistoryJob {
  _id: string;
  title: string;
  company: string;
  location?: string | null;
  status?: string;
}

export interface ATSAnalysisHistoryRun
  extends Omit<ATSAnalysisRun, "jobId"> {
  jobId: ATSAnalysisHistoryJob;
}

export interface CandidateATSHistoryJob {
  _id: string;
  title: string;
  company: string;
  location?: string | null;
  status?: string | null;
}

export interface CandidateATSHistoryItem {
  _id: string;
  analysisRunId: string | null;

  job: CandidateATSHistoryJob | null;

  rankingScore: number;
  rank: number | null;

  eligible: boolean;

  eligibilityReasons: string[];

  matchResult: ATSMatchResult | null;

  createdAt: string;
  updatedAt: string;
}

export interface CandidateATSHistoryResponse {
  success: boolean;
  message: string;
  data: {
    analyses: CandidateATSHistoryItem[];
    count: number;
  };
}