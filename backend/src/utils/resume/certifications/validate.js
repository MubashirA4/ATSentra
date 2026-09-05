export const validateCertification = (certification) => {
  const errors = [];

  if (!certification || typeof certification !== "object") {
    return {
      valid: false,
      errors: ["Certification must be an object"],
    };
  }

  if (!certification.name?.trim()) {
    errors.push("Missing certification name");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateCertifications = (certifications) => {
  if (!Array.isArray(certifications)) {
    return {
      valid: false,
      errors: ["Certifications must be an array"],
    };
  }

  const results = certifications.map(
    (certification, index) => ({
      index,
      ...validateCertification(certification),
    })
  );

  return {
    valid: results.every(
      (result) => result.valid
    ),
    results,
  };
};