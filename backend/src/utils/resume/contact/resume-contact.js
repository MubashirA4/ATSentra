const EMAIL_REGEX =
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const PHONE_REGEX =
  /(?:\+?\d[\d\s().-]{7,}\d)/;

const URL_REGEX =
  /https?:\/\/[^\s]+|(?:www\.)?[a-zA-Z0-9.-]+\.(?:com|org|net|dev|io|pk|me)\/[^\s]*/gi;


/**
 * Extract email address from resume text.
 */
export const extractEmail = (text) => {
  if (!text) return null;

  const match = text.match(EMAIL_REGEX);

  return match ? match[0].trim() : null;
};


/**
 * Extract phone number from resume text.
 */
export const extractPhone = (text) => {
  if (!text) return null;

  const match = text.match(PHONE_REGEX);

  return match ? match[0].trim() : null;
};


/**
 * Normalize a URL.
 */
const normalizeUrl = (url) => {
  if (!url) return null;

  let normalized = url.trim();

  // Remove markdown characters
  normalized = normalized.replace(/[)\],.;]+$/, "");

  // Add protocol if missing
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  return normalized;
};


/**
 * Extract LinkedIn profile URL.
 */
export const extractLinkedIn = (text) => {
  if (!text) return null;

  const urls = text.match(URL_REGEX) || [];

  const linkedinUrl = urls.find((url) =>
    /linkedin\.com\/in\//i.test(url)
  );

  return linkedinUrl
    ? normalizeUrl(linkedinUrl)
    : null;
};


/**
 * Extract GitHub profile URL.
 */
export const extractGitHub = (text) => {
  if (!text) return null;

  const urls = text.match(URL_REGEX) || [];

  const githubUrl = urls.find((url) =>
    /github\.com\//i.test(url)
  );

  return githubUrl
    ? normalizeUrl(githubUrl)
    : null;
};