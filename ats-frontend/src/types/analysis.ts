export interface AnalysisPersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
}

export interface AnalysisExperienceItem {
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  duration: string;
  responsibilities: string[];
  achievements: string[];
}

export interface AnalysisEducationItem {
  degree: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface AnalysisCertification {
  name: string;
  issuer?: string;
  date?: string;
}

export interface ResumeQuality {
  contactInformation: number;
  professionalSummary: number;
  formatting: number;
  completeness: number;
}

export interface AnalysisSkills {
  score: number;
  detected: string[];
  normalized: string[];
}

export interface AnalysisExperience {
  score: number;
  candidateYears: number;
  requiredYears: number;
  items: AnalysisExperienceItem[];
}

export interface AnalysisEducation {
  score: number;
  items: AnalysisEducationItem[];
}

export interface AnalysisKeywords {
  score: number;
  matched: string[];
  missing: string[];
}

export interface ResumeAnalysisData {
  id: string;
  resumeName: string;
  analyzedAt: string;

  overallScore: number;

  personalInfo: AnalysisPersonalInfo;

  summary: string;

  quality: ResumeQuality;

  skills: AnalysisSkills;

  experience: AnalysisExperience;

  education: AnalysisEducation;

  certifications: AnalysisCertification[];

  keywords: AnalysisKeywords;

  recommendations: string[];
}