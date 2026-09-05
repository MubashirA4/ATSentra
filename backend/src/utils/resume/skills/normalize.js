const SKILL_ALIASES = {
  // Programming Languages
  javascript: "JavaScript",

  typescript: "TypeScript",
  ts: "TypeScript",

  python: "Python",

  java: "Java",

  c: "C",
  "c language": "C",

  "c++": "C++",
  cpp: "C++",

  "c#": "C#",
  csharp: "C#",

  go: "Go",
  golang: "Go",

  rust: "Rust",

  php: "PHP",

  ruby: "Ruby",

  kotlin: "Kotlin",

  swift: "Swift",

  // Frontend
  react: "React.js",
  "react.js": "React.js",
  "react js": "React.js",
  reactjs: "React.js",

  angular: "Angular",

  vue: "Vue.js",
  "vue.js": "Vue.js",
  "vue js": "Vue.js",
  vuejs: "Vue.js",

  next: "Next.js",
  "next.js": "Next.js",
  "next js": "Next.js",
  nextjs: "Next.js",

  html: "HTML",
  html5: "HTML",

  css: "CSS",
  css3: "CSS",

  tailwind: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",

  bootstrap: "Bootstrap",

  redux: "Redux",

  // Backend
  node: "Node.js",
  "node.js": "Node.js",
  "node js": "Node.js",
  nodejs: "Node.js",

  express: "Express.js",
  "express.js": "Express.js",
  "express js": "Express.js",
  expressjs: "Express.js",

  django: "Django",

  flask: "Flask",

  spring: "Spring",

  laravel: "Laravel",

  ".net": ".NET",
  dotnet: ".NET",

  // Databases
  mongodb: "MongoDB",
  "mongo db": "MongoDB",
  mongo: "MongoDB",

  mongoose: "Mongoose",

  mysql: "MySQL",

  postgresql: "PostgreSQL",
  postgres: "PostgreSQL",

  sql: "SQL",

  redis: "Redis",

  oracle: "Oracle",

  // Cloud
  aws: "AWS",
  azure: "Azure",

  "google cloud": "Google Cloud",
  gcp: "GCP",

  // DevOps
  docker: "Docker",

  kubernetes: "Kubernetes",
  k8s: "Kubernetes",

  jenkins: "Jenkins",

  "github actions": "GitHub Actions",

  terraform: "Terraform",

  // DevOps / CI-CD
  "ci/cd": "CI/CD",
  "ci cd": "CI/CD",
  "ci/cd pipeline": "CI/CD",
  "ci/cd pipelines": "CI/CD",
  cicd: "CI/CD",

  // Architecture
  microservices: "Microservices",
  "microservice architecture": "Microservices",
  "microservices architecture": "Microservices",

  // Methodologies
  agile: "Agile",
  "agile methodology": "Agile",
  "agile methodologies": "Agile",

  // Testing
  jest: "Jest",

  mocha: "Mocha",

  cypress: "Cypress",

  playwright: "Playwright",

  selenium: "Selenium",

  // Tools
  git: "Git",

  github: "GitHub",

  gitlab: "GitLab",

  postman: "Postman",

  bruno: "Bruno",

  // APIs / Auth
  "rest api": "REST APIs",
  "rest apis": "REST APIs",
  "restful api": "REST APIs",
  "restful apis": "REST APIs",
  "rest api's": "REST APIs",

  graphql: "GraphQL",

  jwt: "JWT",
};

const normalizeKey = (skill) => {
  return skill.trim().replace(/\s+/g, " ").toLowerCase();
};

export const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== "string") {
    return null;
  }

  const cleaned = skill.trim().replace(/\s+/g, " ");

  if (!cleaned) {
    return null;
  }

  const key = normalizeKey(cleaned);

  return SKILL_ALIASES[key] ?? cleaned;
};

export const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills.map(normalizeSkill).filter(Boolean);
};

export const getSkillAliases = () => {
  return Object.entries(SKILL_ALIASES).map(([alias, canonical]) => ({
    alias,
    canonical,
  }));
};
