export const deduplicateSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  const seen = new Set();
  const unique = [];

  for (const skill of skills) {
    if (!skill) {
      continue;
    }

    const key = skill
      .trim()
      .toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(skill);
  }

  return unique;
};