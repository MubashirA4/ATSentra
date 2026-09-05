import { detectProjectsSection } from "./detectProjectsSection.js";
import {
  extractProjectName,
} from "./projectName.js";
import {
  extractProjectDescription,
} from "./projectDescription.js";

const cleanLine = (line) => {
  return line
    ?.trim()
    .replace(/^[•●▪◦*-]\s*/, "")
    .trim();
};

const isNewProject = (line) => {
  return /\s+[—–-]\s+/.test(line);
};

export const parseProjects = (lines) => {
  const section = detectProjectsSection(lines);

  if (!section) {
    return [];
  }

  const projects = [];

  let currentProject = null;

  for (const rawLine of section.lines) {
    const line = cleanLine(rawLine);

    if (!line) {
      continue;
    }

    if (isNewProject(line)) {
      if (currentProject) {
        projects.push(currentProject);
      }

      currentProject = {
        name: extractProjectName(line),
        description: extractProjectDescription(line),
      };

      continue;
    }

    if (currentProject) {
      currentProject.description =
        `${currentProject.description || ""} ${line}`.trim();
    }
  }

  if (currentProject) {
    projects.push(currentProject);
  }

  return projects;
};