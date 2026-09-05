export const splitLanguageTokens = (line) => {
  return line
    .split(/[,;|]/)
    .map((token) => token.trim())
    .filter(Boolean);
};

export const tokenizeLanguageLines = (lines) => {
  if (!Array.isArray(lines)) {
    return [];
  }

  return lines
    .flatMap(splitLanguageTokens)
    .map((line) =>
      line
        .replace(/^[•●▪◦*-]\s*/, "")
        .trim()
    )
    .filter(Boolean);
};