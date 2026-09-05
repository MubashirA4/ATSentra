const validateProject = (project) => {
  const errors = [];

  if (!project || typeof project !== "object") {
    return {
      valid: false,
      errors: ["Project must be an object"],
    };
  }

  if (!project.name?.trim()) {
    errors.push("Missing project name");
  }

  if (!project.description?.trim()) {
    errors.push("Missing project description");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateProjects = (projects) => {
  if (!Array.isArray(projects)) {
    return {
      valid: false,
      errors: ["Projects must be an array"],
    };
  }

  const results = projects.map((project, index) => {
    return {
      index,
      ...validateProject(project),
    };
  });

  return {
    valid: results.every((result) => result.valid),
    results,
  };
};