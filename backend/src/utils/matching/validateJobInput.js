export const validateJobInput = (job) => {
  if (!job || typeof job !== "object") {
    throw new Error("Parsed job description is required");
  }

  if (!Array.isArray(job.requiredSkills)) {
    throw new Error(
      "Invalid job.requiredSkills: expected an array",
    );
  }

  if (!Array.isArray(job.preferredSkills)) {
    throw new Error(
      "Invalid job.preferredSkills: expected an array",
    );
  }

  if (
    job.experienceRequirement !== null &&
    job.experienceRequirement !== undefined &&
    typeof job.experienceRequirement !== "object"
  ) {
    throw new Error(
      "Invalid job.experienceRequirement: expected an object or null",
    );
  }

  if (!Array.isArray(job.educationRequirements)) {
    throw new Error(
      "Invalid job.educationRequirements: expected an array",
    );
  }

  if (
    job.educationRequirements.some(
      (requirement) =>
        typeof requirement !== "string",
    )
  ) {
    throw new Error(
      "Invalid job.educationRequirements: expected an array of strings",
    );
  }

  if (
    job.certifications !== undefined &&
    !Array.isArray(job.certifications)
  ) {
    throw new Error(
      "Invalid job.certifications: expected an array",
    );
  }

  return true;
};