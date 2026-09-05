export const deduplicateCertifications = (certifications) => {
  if (!Array.isArray(certifications)) {
    return [];
  }

  const seen = new Set();

  return certifications.filter((certification) => {
    if (!certification?.name) {
      return false;
    }

    const key = certification.name
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
};