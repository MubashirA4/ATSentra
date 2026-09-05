import type { DashboardData } from "../types/dashboard";

export const mockDashboardData: DashboardData = {
  latestAnalysis: {
    id: "analysis-001",
    resumeName: "Software Engineer Resume",
    analyzedAt: "2026-08-13T09:30:00Z",

    overallScore: 91,

    skills: {
      score: 94,

      detected: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Mongoose",
        "REST APIs",
        "JWT",
        "Git",
      ],

      normalized: [
        "JavaScript",
        "TypeScript",
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Mongoose",
        "RESTful APIs",
        "JWT Authentication",
        "Git",
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
      score: 86,
      matched: 18,
      missing: 4,
    },

    recommendations: [
      "Add Docker experience to your resume.",
      "Mention measurable achievements in your experience section.",
      "Improve your professional summary.",
    ],
  },

  stats: {
    atsScore: 91,
    skillsMatch: 94,
    experienceMatch: 88,
    keywordCoverage: 86,
  },

  health: {
    overallScore: 91,
    skills: 94,
    experience: 88,
    keywords: 86,
  },
};
