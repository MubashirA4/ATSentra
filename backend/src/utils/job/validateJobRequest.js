const validateExperienceRequirement = (
  experienceRequirement,
) => {
  if (
    experienceRequirement === undefined ||
    experienceRequirement === null
  ) {
    return;
  }

  if (
    typeof experienceRequirement !== "object" ||
    Array.isArray(experienceRequirement)
  ) {
    throw new Error(
      "experienceRequirement must be an object or null",
    );
  }

  const {
    minYears,
    maxYears,
  } = experienceRequirement;

  // null is valid because the schema allows null.
  if (
    minYears !== undefined &&
    minYears !== null &&
    (
      typeof minYears !== "number" ||
      !Number.isFinite(minYears) ||
      minYears < 0
    )
  ) {
    throw new Error(
      "experienceRequirement.minYears must be a non-negative number",
    );
  }

  // null is valid because the schema allows null.
  if (
    maxYears !== undefined &&
    maxYears !== null &&
    (
      typeof maxYears !== "number" ||
      !Number.isFinite(maxYears) ||
      maxYears < 0
    )
  ) {
    throw new Error(
      "experienceRequirement.maxYears must be a non-negative number",
    );
  }

  if (
    minYears !== undefined &&
    minYears !== null &&
    maxYears !== undefined &&
    maxYears !== null &&
    minYears > maxYears
  ) {
    throw new Error(
      "Minimum experience cannot exceed maximum experience",
    );
  }
};

const validateStatus = (status) => {
  if (status === undefined) {
    return;
  }

  const allowedStatuses = [
    "draft",
    "open",
    "closed",
    "archived",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid job status");
  }
};

export const validateCreateJobRequest = (
  data,
) => {
  if (!data || typeof data !== "object") {
    throw new Error("Job data is required");
  }

  const {
    title,
    company,
    requiredSkills,
    preferredSkills,
    experienceRequirement,
    educationRequirements,
    responsibilities,
    status,
  } = data;

  if (
    typeof title !== "string" ||
    title.trim() === ""
  ) {
    throw new Error("Job title is required");
  }

  if (
    typeof company !== "string" ||
    company.trim() === ""
  ) {
    throw new Error("Job company is required");
  }

  if (
    requiredSkills !== undefined &&
    !Array.isArray(requiredSkills)
  ) {
    throw new Error(
      "requiredSkills must be an array",
    );
  }

  if (
    preferredSkills !== undefined &&
    !Array.isArray(preferredSkills)
  ) {
    throw new Error(
      "preferredSkills must be an array",
    );
  }

  if (
    educationRequirements !== undefined &&
    !Array.isArray(educationRequirements)
  ) {
    throw new Error(
      "educationRequirements must be an array",
    );
  }

  if (
    responsibilities !== undefined &&
    !Array.isArray(responsibilities)
  ) {
    throw new Error(
      "responsibilities must be an array",
    );
  }

  validateExperienceRequirement(
    experienceRequirement,
  );

  validateStatus(status);

  return true;
};

export const validateUpdateJobRequest = (
  data,
) => {
  if (!data || typeof data !== "object") {
    throw new Error(
      "Job update data is required",
    );
  }

  if (
    Object.keys(data).length === 0
  ) {
    throw new Error(
      "At least one job field is required",
    );
  }

  /*
   * Update requests may contain only a subset
   * of fields, so we should validate only the
   * fields actually provided.
   */

  if (
    data.title !== undefined &&
    (
      typeof data.title !== "string" ||
      data.title.trim() === ""
    )
  ) {
    throw new Error("Job title is required");
  }

  if (
    data.company !== undefined &&
    (
      typeof data.company !== "string" ||
      data.company.trim() === ""
    )
  ) {
    throw new Error("Job company is required");
  }

  if (
    data.requiredSkills !== undefined &&
    !Array.isArray(data.requiredSkills)
  ) {
    throw new Error(
      "requiredSkills must be an array",
    );
  }

  if (
    data.preferredSkills !== undefined &&
    !Array.isArray(data.preferredSkills)
  ) {
    throw new Error(
      "preferredSkills must be an array",
    );
  }

  if (
    data.educationRequirements !== undefined &&
    !Array.isArray(
      data.educationRequirements,
    )
  ) {
    throw new Error(
      "educationRequirements must be an array",
    );
  }

  if (
    data.responsibilities !== undefined &&
    !Array.isArray(data.responsibilities)
  ) {
    throw new Error(
      "responsibilities must be an array",
    );
  }

  if (
    data.experienceRequirement !== undefined
  ) {
    validateExperienceRequirement(
      data.experienceRequirement,
    );
  }

  if (data.status !== undefined) {
    validateStatus(data.status);
  }

  return true;
};