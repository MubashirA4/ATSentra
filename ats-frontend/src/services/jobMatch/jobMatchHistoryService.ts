import api from "../../services/api/axios";

export interface JobMatchCertification {
  required: string;
  candidate: string;
  status: "exact" | "partial";
  score: number;
}

export interface JobMatchCertifications {
  required: number;
  exactMatches: JobMatchCertification[];
  partialMatches: JobMatchCertification[];
  missing: string[];
  score: number;
  matchPercentage: number;
  details: JobMatchCertification[];
}

export interface JobMatchHistoryItem {
  _id: string;
  userId: string;
  resumeId: string;

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

  match: {
    score: number;
    maxScore: number;

    breakdown: {
      requiredSkills: {
        score: number;
        weight: number;
      };

      preferredSkills: {
        score: number;
        weight: number;
      };

      experience: {
        score: number;
        weight: number;
      };

      education: {
        score: number;
        weight: number;
      };

      certifications: {
        score: number;
        weight: number;
      };
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
      candidateYears: number;
      matched: boolean;
      score: number;
    };

    education: {
      matched: boolean;
      score: number;
      matchedRequirements: string[];
      missingRequirements: string[];
    };

    certifications: JobMatchCertifications;
  };

  recommendations: {
    type: string;
    priority: string;
    title: string;
    message: string;
  }[];

  parserVersion: string;

  createdAt: string;
  updatedAt: string;
}

export interface JobMatchHistoryResponse {
  success: boolean;
  message: string;

  data: {
    matches: JobMatchHistoryItem[];

    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface GetJobMatchHistoryParams {
  page?: number;
  limit?: number;
}

export interface JobMatchDetailResponse {
  success: boolean;
  message: string;
  data: JobMatchHistoryItem;
}

export const getCandidateJobMatchHistory = async (
  params: GetJobMatchHistoryParams = {},
): Promise<JobMatchHistoryResponse> => {
  const response =
    await api.get<JobMatchHistoryResponse>(
      "/candidates/job-match/history",
      {
        params,
      },
    );

  return response.data;
};

export const getCandidateJobMatchDetail = async (
  matchId: string,
): Promise<JobMatchDetailResponse> => {
  const response =
    await api.get<JobMatchDetailResponse>(
      `/candidates/job-match/${matchId}`,
    );

  return response.data;
};