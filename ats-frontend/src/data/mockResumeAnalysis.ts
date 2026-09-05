import type { ResumeAnalysisData } from "../types/analysis";

export const mockResumeAnalysis: ResumeAnalysisData = {
  id: "analysis-001",

  resumeName: "Ahmed Raza — Software Engineer Resume",

  analyzedAt: "2026-08-13T09:30:00Z",

  overallScore: 91,

  personalInfo: {
    name: "Ahmed Raza",
    email: "ahmed.raza@example.com",
    phone: "+92 300 1234567",
    location: "Karachi, Pakistan",
    linkedin: "linkedin.com/in/ahmedraza",
    github: "github.com/ahmedraza",
  },

  summary:
    "Software Engineer with 4+ years of experience building scalable web applications using JavaScript, TypeScript, React, Node.js, Express, and MongoDB. Experienced in developing REST APIs, authentication systems, database-driven applications, and modern frontend interfaces.",

  quality: {
    contactInformation: 100,
    professionalSummary: 88,
    formatting: 92,
    completeness: 94,
  },

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

    items: [
      {
        jobTitle: "Software Engineer",
        company: "Tech Solutions Ltd.",
        location: "Karachi, Pakistan",
        startDate: "Jan 2024",
        endDate: "Present",
        duration: "2 yrs 7 mos",

        responsibilities: [
          "Developed and maintained React-based web applications.",
          "Built REST APIs using Node.js and Express.",
          "Designed MongoDB schemas and database queries.",
          "Implemented JWT-based authentication and authorization.",
        ],

        achievements: [
          "Improved API response times by approximately 35%.",
          "Reduced repetitive frontend development effort through reusable components.",
          "Delivered multiple production features across web applications.",
        ],
      },

      {
        jobTitle: "Junior Software Engineer",
        company: "Digital Systems",
        location: "Karachi, Pakistan",
        startDate: "Jun 2022",
        endDate: "Dec 2023",
        duration: "1 yr 7 mos",

        responsibilities: [
          "Developed frontend features using React and JavaScript.",
          "Integrated frontend applications with backend REST APIs.",
          "Worked with MongoDB for application data management.",
        ],

        achievements: [
          "Implemented reusable UI components that improved development consistency.",
          "Contributed to application performance and usability improvements.",
        ],
      },
    ],
  },

  education: {
    score: 95,

    items: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Karachi",
        location: "Karachi, Pakistan",
        startDate: "2018",
        endDate: "2022",
      },
    ],
  },

  certifications: [
    {
      name: "Information Security",
      issuer: "Professional Certification",
      date: "2026",
    },
    {
      name: "AI Fundamentals",
      issuer: "Professional Certification",
      date: "2026",
    },
    {
      name: "Human-Centered Design",
      issuer: "Professional Certification",
      date: "2026",
    },
  ],

  keywords: {
    score: 86,

    matched: [
      "React",
      "Node.js",
      "JavaScript",
      "TypeScript",
      "MongoDB",
      "REST APIs",
      "JWT",
      "Git",
      "Express",
      "Mongoose",
      "Frontend",
      "Backend",
      "Authentication",
      "Web Applications",
      "API Development",
      "Database",
      "Software Engineering",
      "Agile",
    ],

    missing: ["Docker", "AWS", "CI/CD", "Cloud Infrastructure"],
  },

  recommendations: [
    "Add Docker experience if you have genuinely worked with containerized applications.",
    "Mention measurable achievements more consistently throughout your experience section.",
    "Strengthen the professional summary by highlighting your strongest technical specialization.",
    "Include cloud or CI/CD keywords when they accurately represent your experience.",
  ],
};
