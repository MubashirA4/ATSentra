export const validateEducation = (education) => {
  const errors = [];

  if (!education || typeof education !== "object") {
    return {
      valid: false,
      errors: ["Education must be an object"],
    };
  }

  if (!education.degree?.trim()) {
    errors.push("Missing degree");
  }

  if (!education.institution?.trim()) {
    errors.push("Missing institution");
  }

  if (education.isCurrent && education.endDate) {
    errors.push(
      "Current education cannot have an end date",
    );
  }

  if (
    !education.isCurrent &&
    education.startDate &&
    !education.endDate
  ) {
    errors.push(
      "Non-current education should have an end date",
    );
  }

  if (
    education.startDate &&
    education.endDate &&
    education.startDate > education.endDate
  ) {
    errors.push(
      "Education start date cannot be after end date",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateEducations = (educations) => {
  if (!Array.isArray(educations)) {
    return {
      valid: false,
      errors: ["Education must be an array"],
    };
  }

  const results = educations.map(
    (education, index) => {
      const result = validateEducation(education);

      return {
        index,
        ...result,
      };
    },
  );

  return results;
};