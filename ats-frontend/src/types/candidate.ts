export type CandidateStatus =
  | "active"
  | "inactive"
  | "archived";

export interface CandidateExperience {
  jobTitle: string;
  company: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  employmentType: string | null;
  responsibilities: string[];
  achievements: string[];
}

export interface CandidateEducation {
  degree: string;
  institution: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  resume: string | null;
  skills: string[];
  experience: CandidateExperience[];
  education: CandidateEducation[];
  status: CandidateStatus;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CandidatesResponse {
  success: boolean;
  message: string;
  data: {
    candidates: Candidate[];
    count: number;
  };
}

export interface CandidateResponse {
  success: boolean;
  message: string;
  data: {
    candidate: Candidate;
  };
}