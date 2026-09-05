import api from "../api/axios";

import type {
  ATSJob,
  GetJobsParams,
  JobResponse,
  JobsResponse,
  ParseJobDescriptionResponse,
  JobStatus,
} from "../../types/job";

export type CreateJobPayload = Omit<
  ATSJob,
  "_id" | "createdAt" | "updatedAt" | "__v" | "createdBy"
>;

export type UpdateJobPayload = Partial<CreateJobPayload>;

export interface DeleteJobResponse {
  success: boolean;
  message: string;
  data: {
    jobId: string;
  };
}

/**
 * Get jobs
 */
export const getJobs = async (
  params?: GetJobsParams,
): Promise<JobsResponse> => {
  const response = await api.get<JobsResponse>(
    "/jobs",
    {
      params,
    },
  );

  return response.data;
};

/**
 * Get a single job
 */
export const getJobById = async (
  jobId: string,
): Promise<JobResponse> => {
  const response = await api.get<JobResponse>(
    `/jobs/${jobId}`,
  );

  return response.data;
};

/**
 * Parse raw job description into structured job data
 */
export const parseJobDescription = async (
  description: string,
): Promise<ParseJobDescriptionResponse> => {
  const response = await api.post<ParseJobDescriptionResponse>(
    "/jobs/parse",
    {
      description,
    },
  );

  return response.data;
};

/**
 * Create a new job
 */
export const createJob = async (
  jobData: CreateJobPayload,
): Promise<JobResponse> => {
  const response = await api.post<JobResponse>(
    "/jobs",
    jobData,
  );

  return response.data;
};

/**
 * Update an existing job
 *
 * Can update any editable job field, including status.
 *
 * Example:
 * updateJob(jobId, { status: "open" })
 */
export const updateJob = async (
  jobId: string,
  jobData: UpdateJobPayload,
): Promise<JobResponse> => {
  const response = await api.patch<JobResponse>(
    `/jobs/${jobId}`,
    jobData,
  );

  return response.data;
};

/**
 * Update only the job status
 *
 * Convenience wrapper around updateJob().
 */
export const changeJobStatus = async (
  jobId: string,
  status: JobStatus,
): Promise<JobResponse> => {
  return updateJob(jobId, {
    status,
  });
};

/**
 * Delete a job
 */
export const deleteJob = async (
  jobId: string,
): Promise<DeleteJobResponse> => {
  const response = await api.delete<DeleteJobResponse>(
    `/jobs/${jobId}`,
  );

  return response.data;
};