export const validateJobDescription = (job) => {
  const errors = [];

  if (!job || typeof job !== "object") {
    return {
      valid: false,
      errors: ["Job description must be an object"],
    };
  }

  if (!job.jobTitle?.trim()) {
    errors.push("Missing job title");
  }

  if (!Array.isArray(job.requiredSkills)) {
    errors.push("Required skills must be an array");
  }

  if (!Array.isArray(job.preferredSkills)) {
    errors.push("Preferred skills must be an array");
  }

  if (!Array.isArray(job.certifications)) {
    errors.push("Certifications must be an array");
  }

  if (!Array.isArray(job.educationRequirements)) {
    errors.push("Education requirements must be an array");
  }

  if (!Array.isArray(job.responsibilities)) {
    errors.push("Responsibilities must be an array");
  }

  if (
    job.experienceRequirement !== null &&
    typeof job.experienceRequirement !== "object"
  ) {
    errors.push("Experience requirement must be an object or null");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
