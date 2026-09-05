export type JobStatus = "draft" | "open" | "closed" | "archived";

export type JobSortField =
  | "createdAt"
  | "updatedAt"
  | "title"
  | "company"
  | "status";

export interface ExperienceRequirement {
  minYears: number | null;
  maxYears: number | null;
}

export interface ParsedJobDescription {
  jobTitle: string | null;
  company: string | null;
  location: string | null;
  employmentType: string | null;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequirement: ExperienceRequirement & {
    raw?: string;
  };
  educationRequirements: string[];
  responsibilities: string[];
  validation: {
    valid: boolean;
    errors: string[];
  };
}

export interface ParseJobDescriptionResponse {
  success: boolean;
  message: string;
  data: {
    job: ParsedJobDescription;
  };
}

export interface ATSJob {
  _id: string;
  title: string;
  company: string;
  location: string | null;
  employmentType: string | null;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequirement: ExperienceRequirement | null;
  educationRequirements: string[];
  responsibilities: string[];
  description: string | null;
  status: JobStatus;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface GetJobsParams {
  status?: JobStatus;
  company?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: JobSortField;
  sortOrder?: "asc" | "desc";
}

export interface JobsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobsStats {
  all: number;
  draft: number;
  open: number;
  closed: number;
  archived: number;
}

export interface JobsResponse {
  success: boolean;
  message: string;
  data: {
    jobs: ATSJob[];
    pagination: JobsPagination;
    stats: JobsStats;
  };
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: {
    job: ATSJob;
  };
}
