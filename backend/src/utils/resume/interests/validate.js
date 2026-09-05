export const validateInterest = (interest) => {
  if (!interest || typeof interest !== "string") {
    return {
      valid: false,
      errors: ["Interest must be a non-empty string"],
    };
  }

  return {
    valid: true,
    errors: [],
  };
};

export const validateInterests = (interests) => {
  if (!Array.isArray(interests)) {
    return {
      valid: false,
      errors: ["Interests must be an array"],
    };
  }

  const results = interests.map((interest, index) => ({
    index,
    ...validateInterest(interest),
  }));

  return {
    valid: results.every((result) => result.valid),
    errors: results
      .filter((result) => !result.valid)
      .flatMap((result) => result.errors),
  };
};