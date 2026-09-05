export const extractCertificationName = (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  let value = text
    .replace(/\s+/g, " ")
    .trim();

  if (!value) {
    return null;
  }

  value = value
    .split(/\s+\|\s+/)[0]
    .split(/\s+[—–-]\s+/)[0]
    .trim();

  return value || null;
};