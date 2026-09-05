export const extractCertificationIssuer = (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  const match = text.match(
    /\s*(?:\||—|–|-)\s*([^|—–-]+)$/i
  );

  if (!match) {
    return null;
  }

  const issuer = match[1]
    .replace(/\s+/g, " ")
    .trim();

  return issuer || null;
};