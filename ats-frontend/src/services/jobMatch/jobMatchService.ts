import api from "../api/axios";

export interface CandidateJobMatchRequest {
  resumeId: string;
  jobDescription: string;
}

export interface CandidateJobMatchSkillResult {
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[];
  requiredMatchPercentage: number;
  preferredMatchPercentage: number;
}

export interface CandidateJobMatchExperience {
  requiredYears: number | null;
  candidateYears: number;
  matched: boolean;
  score: number;
}

export interface CandidateJobMatchEducation {
  matched: boolean;
  score: number;
  matchedRequirements: string[];
  missingRequirements: string[];
}

export interface CandidateJobMatchBreakdownItem {
  score: number;
  weight: number;
}

export interface CandidateJobMatchResult {
  score: number;
  maxScore: number;
  breakdown: {
    requiredSkills: CandidateJobMatchBreakdownItem;
    preferredSkills: CandidateJobMatchBreakdownItem;
    experience: CandidateJobMatchBreakdownItem;
    education: CandidateJobMatchBreakdownItem;
  };
  skills: CandidateJobMatchSkillResult;
  experience: CandidateJobMatchExperience;
  education: CandidateJobMatchEducation;
}

export interface CandidateJobMatchRecommendation {
  type:
    | "required-skill"
    | "preferred-skill"
    | "experience"
    | "education"
    | "general";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
}

export interface CandidateJobMatchResponse {
  success: boolean;
  message: string;
  data: {
    resume: {
      _id: string;
      originalName: string;
      status: string;
    };
    job: {
      title: string | null;
      company: string | null;
      location: string | null;
      employmentType: string | null;
      requiredSkills: string[];
      preferredSkills: string[];
      experienceRequirement: {
        minYears: number | null;
        maxYears: number | null;
        raw: string | null;
      } | null;
      educationRequirements: string[];
      responsibilities: string[];
    };
    match: CandidateJobMatchResult;
    recommendations: CandidateJobMatchRecommendation[];
  };
}

export const matchCandidateResumeToJob = async (
  payload: CandidateJobMatchRequest,
): Promise<CandidateJobMatchResponse> => {
  const response = await api.post<CandidateJobMatchResponse>(
    "/candidates/job-match",
    payload,
  );

  return response.data;
};