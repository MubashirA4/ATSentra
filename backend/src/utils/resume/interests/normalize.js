export const normalizeInterest = (interest) => {
  if (!interest || typeof interest !== "string") {
    return null;
  }

  const normalized = interest
    .replace(/^[•●▪◦*-]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return null;
  }

  return normalized;
};

export const normalizeInterests = (interests) => {
  if (!Array.isArray(interests)) {
    return [];
  }

  return interests
    .map(normalizeInterest)
    .filter(Boolean);
};