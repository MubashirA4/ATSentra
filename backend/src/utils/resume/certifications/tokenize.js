import { cleanCertificationLine } from "./line.js";

export const tokenizeCertificationLines = (lines) => {
  if (!Array.isArray(lines)) {
    return [];
  }

  return lines
    .map(cleanCertificationLine)
    .filter(Boolean);
};