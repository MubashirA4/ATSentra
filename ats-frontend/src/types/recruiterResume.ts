export type ResumeStatus =
  | "uploaded"
  | "processing"
  | "processed"
  | "failed";

export interface ResumePersonalInfo {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
}

export interface ParsedResume {
  personalInfo?: ResumePersonalInfo;
  summary?: string | null;
  skills?: string[];
  experience?: unknown[];
  education?: unknown[];
  projects?: unknown[];
  certifications?: unknown[];
  languages?: unknown[];
  interests?: unknown[];
}

export interface ResumeContent {
  _id: string;
  resumeId: string;
  extractedText?: string;
  normalizedText?: string;
  parserVersion?: string;
  parsedResume?: ParsedResume | null;
  qualityAnalysis?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface RecruiterResume {
  _id: string;
  candidateId: string | null;

  userId: string | null;
  uploadedBy: string;

  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;

  status: ResumeStatus;

  processingError?: string | null;

  createdAt: string;
  updatedAt: string;

  resumeContent?: ResumeContent | null;
}

export interface RecruiterResumesResponse {
  success: boolean;
  data: {
    resumes: RecruiterResume[];
  };
}

export interface RecruiterResumeResponse {
  success: boolean;
  message?: string;
  data: {
    resume: RecruiterResume;
    resumeContent?: ResumeContent;
  };
}