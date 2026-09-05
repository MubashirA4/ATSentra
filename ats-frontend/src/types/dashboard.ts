export interface DashboardStats {
  atsScore: number;
  skillsMatch: number;
  experienceMatch: number;
  keywordCoverage: number;
}

export interface ResumeHealth {
  overallScore: number;
  skills: number;
  experience: number;
  keywords: number;
}

export interface DashboardLatestAnalysis {
  id: string;
  resumeName: string;
  analyzedAt: string;

  overallScore: number;

  skills: {
    score: number;
    detected: string[];
    normalized: string[];
  };

  experience: {
    score: number;
    candidateYears: number;
    requiredYears: number;
  };

  education: {
    score: number;
  };

  keywords: {
    score: number;
    matched: number;
    missing: number;
  };

  recommendations: string[];
}

export interface DashboardData {
  latestAnalysis: DashboardLatestAnalysis;
  stats: DashboardStats;
  health: ResumeHealth;
}