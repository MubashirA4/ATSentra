export const validateLanguage = (language) => {
  const errors = [];

  if (!language || typeof language !== "object") {
    return {
      valid: false,
      errors: ["Language must be an object"],
    };
  }

  if (!language.name?.trim()) {
    errors.push("Missing language name");
  }

  if (
    language.proficiency !== null &&
    typeof language.proficiency !== "string"
  ) {
    errors.push("Invalid proficiency");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateLanguages = (languages) => {
  if (!Array.isArray(languages)) {
    return {
      valid: false,
      errors: ["Languages must be an array"],
    };
  }

  const results = languages.map((language, index) => ({
    index,
    ...validateLanguage(language),
  }));

  return {
    valid: results.every((result) => result.valid),
    errors: results
      .filter((result) => !result.valid)
      .flatMap((result) => result.errors),
  };
};