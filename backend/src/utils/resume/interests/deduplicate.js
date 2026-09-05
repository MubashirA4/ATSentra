export const deduplicateInterests = (interests) => {
  const seen = new Set();

  return interests.filter((interest) => {
    const key = interest.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
};