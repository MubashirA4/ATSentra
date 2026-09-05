export const extractCredentialId = (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  const match = text.match(
    /(?:credential\s*(?:id|number)?|certification\s*id|id)\s*[:#-]?\s*([A-Z0-9][A-Z0-9._/-]*)/i
  );

  return match?.[1] ?? null;
};