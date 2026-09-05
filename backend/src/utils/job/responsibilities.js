import { cleanLine } from "../shared/textUtils.js";

export const extractResponsibilities = (lines) => {
  if (!Array.isArray(lines)) {
    return [];
  }

  return lines
    .map(cleanLine)
    .filter(Boolean);
};