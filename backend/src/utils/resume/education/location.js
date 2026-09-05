const LOCATION_HINT_PATTERN =
  /\b(?:karachi|lahore|islamabad|rawalpindi|multan|peshawar|quetta|faisalabad|hyderabad|sialkot|gujranwala|pakistan|india|usa|uk|canada|australia|germany|france|uae|dubai)\b/i;

const LOCATION_SUFFIX_PATTERN =
  /\b(?:karachi|lahore|islamabad|rawalpindi|multan|peshawar|quetta|faisalabad|hyderabad|sialkot|gujranwala)\s*,\s*(?:pakistan|india|usa|uk|canada|australia|germany|france|uae|dubai)\s*$/i;

const normalizeLocation = (line) => {
  if (!line || typeof line !== "string") {
    return "";
  }

  return line
    .trim()
    .replace(/\s+/g, " ")
    .trim();
};

export const isLikelyEducationLocation = (line) => {
  const cleaned = normalizeLocation(line);

  if (!cleaned) {
    return false;
  }

  return LOCATION_SUFFIX_PATTERN.test(cleaned);
};

export const extractEducationLocation = (lines) => {
  if (!Array.isArray(lines)) {
    return null;
  }

  for (const line of lines) {
    const cleaned = normalizeLocation(line);

    if (!cleaned) {
      continue;
    }

    const match = cleaned.match(LOCATION_SUFFIX_PATTERN);

    if (!match) {
      continue;
    }

    return match[0].trim();
  }

  return null;
};

export const extractInstitutionWithoutLocation = (
  line,
  location,
) => {
  const cleaned = normalizeLocation(line);

  if (!cleaned || !location) {
    return cleaned || null;
  }

  const locationIndex = cleaned
    .toLowerCase()
    .lastIndexOf(location.toLowerCase());

  if (locationIndex === -1) {
    return cleaned;
  }

  return cleaned
    .slice(0, locationIndex)
    .trim()
    .replace(/[|,–—-]+$/, "")
    .trim() || null;
};