export const deduplicateLanguages = (languages) => {
  const seen = new Set();

  return languages.filter((language) => {
    const key = language.name.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
};