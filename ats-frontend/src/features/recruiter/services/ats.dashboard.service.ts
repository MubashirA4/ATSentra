import api from "@lib/axios";
import type { ATSDashboardResponse } from "@types/atsDashboard";

export interface GetATSDashboardParams {
  jobId: string;
  page?: number;
  limit?: number;
  search?: string;
  skill?: string;
  eligible?: boolean;
  minScore?: number;
  maxScore?: number;
  sortBy?: "rankingScore" | "rank" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export const getATSDashboard = async ({
  jobId,
  page = 1,
  limit = 10,
  search = "",
  skill = "",
  eligible,
  minScore,
  maxScore,
  sortBy = "rankingScore",
  sortOrder = "desc",
}: GetATSDashboardParams): Promise<ATSDashboardResponse> => {
  const response = await api.get<ATSDashboardResponse>(
    `/ats/jobs/${jobId}/dashboard`,
    {
      params: {
        page,
        limit,
        search: search || undefined,
        skill: skill || undefined,
        eligible,
        minScore,
        maxScore,
        sortBy,
        sortOrder,
      },
    },
  );

  return response.data;
};
