import api from "../api/axios";

import type {
  ATSAnalysisHistoryRun,
  ATSAnalysisRun,
  ATSCandidateResult,
} from "../../types/atsAnalysis";

export interface ATSAnalysisHistoryResponse {
  success: boolean;
  message: string;
  data: {
    runs: ATSAnalysisHistoryRun[];
  };
}

export interface ATSAnalysisHistoryDetailsResponse {
  success: boolean;
  message: string;

  data: {
    analysisRun: ATSAnalysisRun;
    job: import("../../types/job").ATSJob;
    candidates: ATSCandidateResult[];
  };
}

export const getATSAnalysisHistory =
  async (): Promise<ATSAnalysisHistoryRun[]> => {
    const response =
      await api.get<ATSAnalysisHistoryResponse>("/ats/analysis");

    return response.data.data.runs;
  };

export const getATSAnalysisHistoryDetails =
  async (
    runId: string,
  ): Promise<ATSAnalysisHistoryDetailsResponse> => {
    const response =
      await api.get<ATSAnalysisHistoryDetailsResponse>(
        `/ats/analysis/${runId}`,
      );

    return response.data;
  };