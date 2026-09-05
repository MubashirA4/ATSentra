import { extractLocation } from "../shared/location.js";

export const extractJobLocation = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return null;
  }

  return extractLocation(lines.join("\n"));
};