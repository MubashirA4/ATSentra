const REMOTE_LOCATION_PATTERN =
  /^(remote|hybrid|on[- ]site|onsite|work from home|wfh)$/i;

const CITY_COUNTRY_PATTERN =
  /^[A-Za-zÀ-ÿ.'-]+(?:[\s-]+[A-Za-zÀ-ÿ.'-]+)*,\s*[A-Za-zÀ-ÿ.'-]+(?:[\s-]+[A-Za-zÀ-ÿ.'-]+)*$/;

const COMPANY_LOCATION_PATTERN =
  /^(.+?)\s+([A-Za-zÀ-ÿ.'-]+(?:\s+[A-Za-zÀ-ÿ.'-]+)?,\s*[A-Za-zÀ-ÿ.'-]+(?:\s+[A-Za-zÀ-ÿ.'-]+)?)$/;

const cleanLocationLine = (line) => {
  if (!line || typeof line !== "string") {
    return "";
  }

  return line
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^[•●▪◦○*-]\s*/, "")
    .trim();
};

export const isLikelyExperienceLocation = (line) => {
  const cleanedLine = cleanLocationLine(line);

  if (!cleanedLine) {
    return false;
  }

  if (REMOTE_LOCATION_PATTERN.test(cleanedLine)) {
    return true;
  }

  if (CITY_COUNTRY_PATTERN.test(cleanedLine)) {
    return true;
  }

  return false;
};

const extractLocationFromCompanyLine = (line) => {
  const cleanedLine = cleanLocationLine(line);

  if (!cleanedLine) {
    return null;
  }

  const words = cleanedLine.split(" ");

  // Try location candidates from the right side.
  // This is important because the location normally appears
  // at the end of a company/location line.
  for (let i = words.length - 2; i >= 0; i--) {
    const possibleLocation = words.slice(i).join(" ");

    if (isLikelyExperienceLocation(possibleLocation)) {
      return possibleLocation;
    }
  }

  return null;
};

const removeLocationFromLine = (line, location) => {
  if (!line || !location) {
    return line;
  }

  const cleanedLine = cleanLocationLine(line);

  if (!cleanedLine) {
    return "";
  }

  const locationIndex = cleanedLine.toLowerCase().lastIndexOf(
    location.toLowerCase()
  );

  if (locationIndex === -1) {
    return cleanedLine;
  }

  return cleanedLine
    .slice(0, locationIndex)
    .trim()
    .replace(/[|,\-–—]+$/, "")
    .trim();
};

export const extractExperienceCompany = ({
  block = [],
  dateIndex = -1,
  headerLines = [],
  location = null,
}) => {
  if (!Array.isArray(block) || block.length === 0) {
    return null;
  }

  const headers = Array.isArray(headerLines) ? headerLines : [];

  // Look at the header lines first.
  for (const header of headers) {
    if (!header) continue;

    const cleanedHeader = cleanLocationLine(header);

    if (!cleanedHeader) continue;

    // If the header contains the extracted location,
    // remove the location suffix and keep the company.
    if (location) {
      const company = removeLocationFromLine(
        cleanedHeader,
        location
      );

      if (company && company !== cleanedHeader) {
        return company;
      }
    }
  }

  // Fallback: inspect lines before the date.
  if (dateIndex !== -1) {
    for (let i = 0; i < dateIndex; i++) {
      const line = cleanLocationLine(block[i]);

      if (!line) continue;

      if (location) {
        const company = removeLocationFromLine(line, location);

        if (company && company !== line) {
          return company;
        }
      }
    }
  }

  return null;
};

export const extractExperienceLocation = ({
  block = [],
  dateIndex = -1,
  headerLines = [],
}) => {
  if (!Array.isArray(block) || block.length === 0) {
    return null;
  }

  // -----------------------------------------
  // 1. Check location inside header
  // -----------------------------------------

  const headers = Array.isArray(headerLines)
    ? headerLines
    : [];

  for (const header of headers) {
    if (!header) continue;

    const parts = header
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);

    for (let i = 1; i < parts.length; i++) {
      if (isLikelyExperienceLocation(parts[i])) {
        return parts[i];
      }
    }

    const embeddedLocation =
      extractLocationFromCompanyLine(header);

    if (embeddedLocation) {
      return embeddedLocation;
    }
  }

  // -----------------------------------------
  // 2. Check lines before the date
  // -----------------------------------------

  if (dateIndex !== -1) {
    for (let i = 0; i < dateIndex; i++) {
      const line = block[i];

      if (!line) {
        continue;
      }

      const cleanedLine = line
        .trim()
        .replace(/\s+/g, " ");

      if (!cleanedLine) {
        continue;
      }

      if (isLikelyExperienceLocation(cleanedLine)) {
        return cleanedLine;
      }

      const embeddedLocation =
        extractLocationFromCompanyLine(cleanedLine);

      if (embeddedLocation) {
        return embeddedLocation;
      }
    }
  }

  // -----------------------------------------
  // 3. Check lines after an embedded date
  // -----------------------------------------

  if (dateIndex !== -1) {
    const nextLine = block[dateIndex + 1];

    if (nextLine) {
      const cleanedNextLine = nextLine
        .trim()
        .replace(/\s+/g, " ");

      if (isLikelyExperienceLocation(cleanedNextLine)) {
        return cleanedNextLine;
      }

      const embeddedLocation =
        extractLocationFromCompanyLine(cleanedNextLine);

      if (embeddedLocation) {
        return embeddedLocation;
      }
    }
  }

  return null;
};