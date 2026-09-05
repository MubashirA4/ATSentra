import { useCallback, useState } from "react";

import { executeATS } from "../services/ats/atsAnalysis";

import type {
  ATSExecutionRequest,
  ATSExecutionResponse,
} from "../types/atsAnalysis";

export const useATSAnalysis = () => {
  const [result, setResult] =
    useState<ATSExecutionResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const execute = useCallback(
    async (payload: ATSExecutionRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await executeATS(payload);

        setResult(response);

        return response;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to execute ATS analysis.";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    loading,
    error,
    execute,
    reset,
  };
};