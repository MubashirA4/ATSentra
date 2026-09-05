import { isPdfArtifact } from "../experience/experienceText.js";
import { cleanLine } from "../../shared/textUtils.js";


export const parseSummary = (lines) => {
  if (!Array.isArray(lines)) {
    return "";
  }

  const summaryLines = lines
    .filter((line) => typeof line === "string")
    .map((line) => cleanLine(line))
    .filter(Boolean)
    .filter((line) => !isPdfArtifact(line));

  return summaryLines.join(" ");
};