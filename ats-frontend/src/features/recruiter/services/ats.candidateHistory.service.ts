import api from "@lib/axios";

import type {
  CandidateATSHistoryItem,
  CandidateATSHistoryResponse,
} from "@types/atsAnalysis";

export const getCandidateATSHistory = async (
  candidateId: string,
): Promise<CandidateATSHistoryItem[]> => {
  const response =
    await api.get<CandidateATSHistoryResponse>(
      `/ats/candidates/${candidateId}/history`,
    );

  return response.data.data.analyses;
};
