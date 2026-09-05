export const normalizeLineBreaks = (text) => {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
};

export const removeNullCharacters = (text) => {
  return text.replace(/\0/g, "");
};

export const normalizeSpaces = (text) => {
  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n");
};

export const normalizeBlankLines = (text) => {
  return text.replace(/\n{3,}/g, "\n\n");
};


export const cleanResumeText = (text) => {
  if (!text || typeof text !== "string") {
    return "";
  }

  let cleanedText = text;

  cleanedText = removeNullCharacters(cleanedText);

  cleanedText = normalizeLineBreaks(cleanedText);

  cleanedText = normalizeSpaces(cleanedText);

  cleanedText = normalizeBlankLines(cleanedText);

  return cleanedText.trim();
};
