import { reconstructLines } from "./line-reconstruction.js";


export const prepareDocument = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Document text is required");
  }

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const reconstructedLines = reconstructLines(lines);

  return {
    lines,
    reconstructedLines,
    reconstructedText: reconstructedLines.join("\n"),
  };
};