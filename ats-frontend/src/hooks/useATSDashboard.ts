import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getATSDashboard,
  type GetATSDashboardParams,
} from "../services/ats/dashboard";

import type {
  ATSDashboardData,
} from "../types/atsDashboard";

interface UseATSDashboardResult {
  data: ATSDashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const useATSDashboard = (
  params: GetATSDashboardParams | null,
): UseATSDashboardResult => {
  const [data, setData] =
    useState<ATSDashboardData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const jobId = params?.jobId ?? null;
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const search = params?.search ?? "";
  const skill = params?.skill ?? "";
  const eligible = params?.eligible;
  const minScore = params?.minScore;
  const maxScore = params?.maxScore;
  const sortBy = params?.sortBy ?? "rankingScore";
  const sortOrder = params?.sortOrder ?? "desc";

  const loadDashboard = useCallback(
    async () => {
      if (!jobId) {
        setData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getATSDashboard({
          jobId,
          page,
          limit,
          search,
          skill,
          eligible,
          minScore,
          maxScore,
          sortBy,
          sortOrder,
        });

        setData(response.data);
      } catch (error) {
        console.error(
          "Failed to load ATS dashboard:",
          error,
        );

        setError(
          "Unable to load the ATS dashboard.",
        );

        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [
      jobId,
      page,
      limit,
      search,
      skill,
      eligible,
      minScore,
      maxScore,
      sortBy,
      sortOrder,
    ],
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    data,
    loading,
    error,
    refresh: loadDashboard,
  };
};

export default useATSDashboard;