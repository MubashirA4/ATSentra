import type { ResumeAnalysis } from "../types/resume";

export const mockResumeAnalysis: ResumeAnalysis = {
  overallScore: 91,

  skills: {
    matched: [
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "Express",
    ],
    missing: [
      "Docker",
      "AWS",
    ],
  },

  experience: {
    score: 88,
    candidateYears: 4,
    requiredYears: 3,
  },

  education: {
    score: 95,
  },

  keywords: {
    matched: 18,
    missing: 4,
  },

  suggestions: [
    "Add Docker experience to your resume.",
    "Mention measurable achievements in your experience section.",
    "Improve your professional summary.",
  ],
};