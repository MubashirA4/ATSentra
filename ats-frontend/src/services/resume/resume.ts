import api from "../api/axios";

import type {
  ProcessResumeResponse,
  ResumeAnalysisResponse,
  ResumeDeleteResponse,
  ResumeResponse,
  ResumeUploadResponse,
  ResumesResponse,
} from "../../types/resume";

export const uploadResume = async (
  file: File,
): Promise<ResumeUploadResponse> => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await api.post<ResumeUploadResponse>(
    "/resumes",
    formData,
  );

  return response.data;
};

export const processResume = async (
  resumeId: string,
): Promise<ProcessResumeResponse> => {
  const response = await api.post<ProcessResumeResponse>(
    `/resumes/${resumeId}/process`,
  );

  return response.data;
};

export const getResumeAnalysis = async (
  resumeId: string,
): Promise<ResumeAnalysisResponse> => {
  const response = await api.get<ResumeAnalysisResponse>(
    `/resumes/${resumeId}/analysis`,
  );

  return response.data;
};

export const getResumes = async (): Promise<ResumesResponse> => {
  const response = await api.get<ResumesResponse>(
    "/resumes",
  );

  return response.data;
};

export const getResume = async (
  resumeId: string,
): Promise<ResumeResponse> => {
  const response = await api.get<ResumeResponse>(
    `/resumes/${resumeId}`,
  );

  return response.data;
};

export const deleteResume = async (
  resumeId: string,
): Promise<ResumeDeleteResponse> => {
  const response = await api.delete<ResumeDeleteResponse>(
    `/resumes/${resumeId}`,
  );

  return response.data;
};