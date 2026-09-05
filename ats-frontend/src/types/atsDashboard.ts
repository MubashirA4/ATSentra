export interface ATSDashboardOverview {
  totalCandidates: number;
  eligibleCandidates: number;
  ineligibleCandidates: number;
  eligibilityRate: number;

  averageScore: number;
  averageRankingScore: number;

  highestScore: number;
  lowestScore: number;

  highestRankingScore: number;
  lowestRankingScore: number;
}

export interface ATSCandidate {
  _id: string;
  name: string;
  email: string;
  location?: string | null;
  skills: string[];
}

export interface ATSTopCandidate {
  analysisId: string;
  candidateId: string;

  rank: number;
  rankingScore: number;
  matchScore: number;

  eligible: boolean;
  eligibilityReasons: string[];

  candidate: ATSCandidate | null;
}

export interface ATSSkillGap {
  skill: string;
  count: number;
}

export interface ATSExperienceStats {
  averageCandidateYears: number;
  averageRequiredYears: number;

  experienceMatched: number;
  experienceNotMatched: number;
}

export interface ATSEducationStats {
  educationMatched: number;
  educationNotMatched: number;

  averageEducationScore: number;
}

export interface ATSScoreDistribution {
  _id: number | string;
  count: number;
}

export interface ATSRankingDistribution {
  _id: number;
  count: number;
}

export interface ATSDistributions {
  score: ATSScoreDistribution[];
  ranking: ATSRankingDistribution[];
}

export interface ATSRecentCandidate {
  _id: string;
  jobId: string;
  candidateId: string;

  rank: number;
  rankingScore: number;

  eligible: boolean;
  eligibilityReasons: string[];

  matchResult?: unknown;
  explanation?: unknown;
  rankingComparison?: unknown;

  status?: string;

  createdAt: string;
  updatedAt: string;

  candidate: ATSCandidate | null;
}

export interface ATSDashboardPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ATSDashboardFilters {
  search: string | null;
  skill: string | null;

  eligible: boolean | null;

  minScore: number | null;
  maxScore: number | null;

  page: number;
  limit: number;

  sortBy: "rankingScore" | "rank" | "createdAt";
  sortOrder: "asc" | "desc";
}

export interface ATSDashboardData {
  overview: ATSDashboardOverview;

  topCandidates: ATSTopCandidate[];

  skillGaps: ATSSkillGap[];
  requiredSkillGaps: ATSSkillGap[];

  experience: ATSExperienceStats;
  education: ATSEducationStats;

  distributions: ATSDistributions;

  recentCandidates: ATSRecentCandidate[];

  pagination: ATSDashboardPagination;

  filters: ATSDashboardFilters;
}

export interface ATSDashboardResponse {
  success: boolean;
  message: string;
  data: ATSDashboardData;
}