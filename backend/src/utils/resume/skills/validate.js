export const validateSkill = (skill) => {
  const errors = [];

  if (!skill || typeof skill !== "string") {
    errors.push("Skill must be a string");

    return {
      valid: false,
      errors,
    };
  }

  const cleaned = skill.trim();

  if (!cleaned) {
    errors.push("Skill cannot be empty");
  }

  if (cleaned.length > 100) {
    errors.push("Skill is too long");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return {
      valid: false,
      errors: ["Skills must be an array"],
    };
  }

  const results = skills.map((skill, index) => {
    const result = validateSkill(skill);

    return {
      index,
      skill,
      ...result,
    };
  });

  const invalid = results.filter(
    (result) => !result.valid
  );

  return {
    valid: invalid.length === 0,
    errors: invalid,
  };
};