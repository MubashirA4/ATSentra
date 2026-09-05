export const validateSummary = (summary) => {
  if (typeof summary !== "string") {
    return false;
  }

  return summary.trim().length > 0;
};