import api from "../api/axios";

import type {
  RecruiterResume,
  RecruiterResumesResponse,
  RecruiterResumeResponse,
} from "../../types/recruiterResume";

export const getRecruiterResumes = async (): Promise<RecruiterResume[]> => {
  const response =
    await api.get<RecruiterResumesResponse>("/resumes/recruiter");

  return response.data.data.resumes;
};

export const uploadRecruiterResume = async (
  file: File,
): Promise<RecruiterResume> => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await api.post<RecruiterResumeResponse>(
    "/resumes/recruiter",
    formData,
  );

  return response.data.data.resume;
};

export const processRecruiterResume = async (
  resumeId: string,
): Promise<RecruiterResumeResponse["data"]> => {
  const response = await api.post<RecruiterResumeResponse>(
    `/resumes/${resumeId}/process`,
  );

  return response.data.data;
};

export const deleteRecruiterResume = async (
  resumeId: string,
): Promise<void> => {
  await api.delete(`/resumes/${resumeId}`);
};

export const getRecruiterResumeDetails = async (
  resumeId: string,
): Promise<RecruiterResumeResponse["data"]> => {
  const response = await api.get<RecruiterResumeResponse>(
    `/resumes/recruiter/${resumeId}`,
  );

  return response.data.data;
};
