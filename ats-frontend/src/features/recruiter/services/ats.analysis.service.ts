import api from "@lib/axios";

import type {
  ATSExecutionRequest,
  ATSExecutionResponse,
} from "@types/atsAnalysis";

export const executeATS = async (
  payload: ATSExecutionRequest,
): Promise<ATSExecutionResponse> => {
  const response = await api.post<ATSExecutionResponse>(
    "/ats/execute",
    payload,
  );

  return response.data;
};
