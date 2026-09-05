import { cleanLine } from "./textUtils.js";

/**
 * Detect a likely location.
 */
export const extractLocation = (text) => {
  if (!text) return null;

  const lines = text.split("\n").map(cleanLine).filter(Boolean);

  const topLines = lines.slice(0, 10);

  for (const line of topLines) {
    const locationMatch = line.match(/^location\s*[:\-]\s*(.+)$/i);

    if (locationMatch) {
      return locationMatch[1].trim();
    }

    const parts = line
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);

    for (const part of parts) {
      // Ignore email
      if (/@/.test(part)) continue;

      // Ignore phone numbers
      if (/\+?\d[\d\s().-]{6,}/.test(part)) continue;

      // Ignore social links
      if (/linkedin|github/i.test(part)) continue;

      // Location:
      // Karachi, Pakistan
      // Lahore, Pakistan
      // Karachi, Sindh, Pakistan
      if (
        /^[A-Za-zÀ-ÖØ-öø-ÿ.' -]+,\s*[A-Za-zÀ-ÖØ-öø-ÿ.' -]+(?:,\s*[A-Za-zÀ-ÖØ-öø-ÿ.' -]+)?$/.test(
          part,
        )
      ) {
        return part;
      }
    }
  }

  return null;
};
