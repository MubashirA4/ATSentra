export const tokenizeInterestLines = (lines) => {
  if (!Array.isArray(lines)) {
    return [];
  }

  return lines
    .flatMap((line) =>
      line
        .replace(/^[•●▪◦*-]\s*/, "")
        .split(/[,;|]/)
    )
    .map((interest) => interest.trim())
    .filter(Boolean);
};