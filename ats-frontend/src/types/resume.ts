export interface Resume {
  _id: string;
  userId: string;
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  status: "uploaded" | "processing" | "processed" | "failed";
  processingError: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ParsedPersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
}

export interface ParsedExperience {
  jobTitle: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  employmentType: string | null;
  responsibilities: string[];
  achievements: string[];
}

export interface ParsedEducation {
  degree: string;
  institution: string;
  location: string | null;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface ParsedProject {
  name: string;
  description: string;
}

export interface ParsedCertification {
  name: string;
  issuer: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  credentialId: string | null;
}

export interface ParsedResume {
  personalInfo: ParsedPersonalInfo;
  summary: string;
  skills: string[];
  experience: ParsedExperience[];
  education: ParsedEducation[];
  projects: ParsedProject[];
  certifications: ParsedCertification[];
  languages: string[];
  interests: string[];
}

export interface QualitySection {
  score: number;
  maxScore: number;
  issues: string[];
  strengths: string[];
}

export interface ResumeQualityAnalysis {
  score: number;
  maxScore: number;
  percentage: number;

  breakdown: {
    contact: QualitySection;
    summary: QualitySection;
    skills: QualitySection;
    experience: QualitySection;
    education: QualitySection;
    projects: QualitySection;
    certifications: QualitySection;
    languages: QualitySection;
    achievements: QualitySection;
    structure: QualitySection;
  };

  rating: string;

  strengths: string[];
  issues: string[];
}

export interface ResumeContent {
  _id: string;
  resumeId: string;
  extractedText: string;
  normalizedText: string;
  parsedResume: ParsedResume;
  qualityAnalysis: ResumeQualityAnalysis;
  parserVersion: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/*
 * Resume API responses
 */

export interface ResumeUploadResponse {
  success: boolean;
  message: string;
  data: {
    resume: Resume;
  };
}

export interface ResumesResponse {
  success: boolean;
  message: string;
  data: {
    resumes: Resume[];
    count: number;
  };
}

export interface ResumeResponse {
  success: boolean;
  message: string;
  data: {
    resume: Resume;
  };
}

export interface ResumeDeleteResponse {
  success: boolean;
  message: string;
  data: {
    resumeId: string;
  };
}

export interface ProcessResumeResponse {
  success: boolean;
  message: string;
  data: {
    resume: Resume;
    resumeContent: ResumeContent;
  };
}

export interface ResumeAnalysisResponse {
  overallScore: number;
  success: boolean;
  message?: string;
  data: {
    resume: Resume;
    resumeContent: ResumeContent;
  };
}

/*
 * Legacy/mock candidate dashboard analysis type.
 *
 * This is kept because mockData.ts and existing candidate
 * dashboard code still use this contract.
 */
export interface ResumeAnalysis {
  overallScore: number;

  skills: {
    matched: string[];
    missing: string[];
  };

  experience: {
    score: number;
    candidateYears: number;
    requiredYears: number;
  };

  education: {
    score: number;
  };

  keywords: {
    matched: number;
    missing: number;
  };

  suggestions: string[];
}