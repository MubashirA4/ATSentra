export const CATEGORY_MAP = {
  programmingLanguages: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C",
    "C++",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Kotlin",
    "Swift",
  ],

  frontend: [
    "React.js",
    "Angular",
    "Vue.js",
    "Next.js",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Redux",
  ],

  backend: [
    "Node.js",
    "Express.js",
    "Django",
    "Flask",
    "Spring",
    "Laravel",
    ".NET",
  ],

  databases: [
    "MongoDB",
    "Mongoose",
    "MySQL",
    "PostgreSQL",
    "SQL",
    "Redis",
    "Oracle",
  ],

  cloud: [
    "AWS",
    "Azure",
    "Google Cloud",
    "GCP",
  ],

  devops: [
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitHub Actions",
    "Terraform",
    "CI/CD",
  ],

  testing: [
    "Jest",
    "Mocha",
    "Cypress",
    "Playwright",
    "Selenium",
  ],

  tools: [
    "Git",
    "GitHub",
    "GitLab",
    "Postman",
    "Bruno",
  ],

  apis: [
    "REST APIs",
    "GraphQL",
    "JWT",
  ],

  architecture: [
    "Microservices",
  ],

  methodologies: [
    "Agile",
  ],
};

export const detectSkillCategory = (skill) => {
  if (!skill) {
    return "other";
  }

  for (const [category, categorySkills] of Object.entries(
    CATEGORY_MAP,
  )) {
    if (
      categorySkills.some(
        (categorySkill) =>
          categorySkill.toLowerCase() ===
          skill.toLowerCase(),
      )
    ) {
      return category;
    }
  }

  return "other";
};

export const categorizeSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills.map((skill) => ({
    name: skill,
    category: detectSkillCategory(skill),
  }));
};