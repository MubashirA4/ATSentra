import { extractLocation } from "../../shared/location.js";
import { extractEmail, extractGitHub, extractLinkedIn, extractPhone } from "../contact/resume-contact.js";


const NAME_EXCLUDED_WORDS = [
  "resume",
  "curriculum vitae",
  "cv",
  "curriculum",
  "vitae",
  "profile",
  "summary",
  "objective",
  "professional summary",
  "professional profile",
  "skills",
  "experience",
  "work experience",
  "education",
  "projects",
  "certifications",
];


const cleanLine = (line) => {
  return line
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^[|•\-–—]+/, "")
    .trim();
};


/**
 * Detect whether a line looks like a person's name.
 */
const looksLikeName = (line) => {
  if (!line) return false;

  const normalized = line.toLowerCase();

  if (
    NAME_EXCLUDED_WORDS.some((word) =>
      normalized === word
    )
  ) {
    return false;
  }

  // Don't consider emails as names
  if (/@/.test(line)) return false;

  // Don't consider URLs as names
  if (/https?:\/\//i.test(line)) return false;

  if (/linkedin|github/i.test(line)) {
    return false;
  }

  // Name usually contains only letters, spaces,
  // apostrophes, dots or hyphens.
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ.'-]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ.'-]+){1,4}$/.test(line)) {
    return false;
  }

  return true;
};


/**
 * Extract candidate name from the beginning
 * of the resume.
 */
export const extractName = (text) => {
  if (!text) return null;

  const lines = text
    .split("\n")
    .map(cleanLine)
    .filter(Boolean);

  // Only inspect the first few lines because
  // the candidate name is normally near the top.
  const topLines = lines.slice(0, 10);

  for (const line of topLines) {
    if (looksLikeName(line)) {
      return line;
    }
  }

  return null;
};




export const extractPersonalInfo = (text) => {
  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    linkedin: extractLinkedIn(text),
    github: extractGitHub(text),
  };
};