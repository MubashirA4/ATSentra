import api from "@lib/axios";

import type {
  Candidate,
  CandidateResponse,
  CandidatesResponse,
  CandidateStatus,
} from "@types/candidate";

export const getCandidates = async (
  status?: CandidateStatus,
): Promise<CandidatesResponse["data"]> => {
  const response = await api.get<CandidatesResponse>(
    "/candidates",
    {
      params: status ? { status } : undefined,
    },
  );

  return response.data.data;
};

export const getCandidateById = async (
  candidateId: string,
): Promise<Candidate> => {
  const response = await api.get<CandidateResponse>(
    `/candidates/${candidateId}`,
  );

  return response.data.data.candidate;
};
