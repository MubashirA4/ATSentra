import { cleanLine } from "../../shared/textUtils.js";

/**
 * Detect whether a string contains a month name.
 */
const MONTH_PATTERN =
  "(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";

/**
 * Detect a date value such as:
 *
 * January 2024
 * Jan 2024
 * 2024
 * 01/2024
 * 01-2024
 */
const DATE_VALUE_PATTERN = new RegExp(
  `(?:${MONTH_PATTERN}\\s+)?\\d{4}|\\d{1,2}[/-]\\d{4}`,
  "i",
);

/**
 * Detect an experience date range such as:
 *
 * January 2024 - Present
 * Jan 2022 - Dec 2024
 * 2022 - 2024
 * 01/2022 - 12/2024
 * 2022 to Present
 */
const DATE_RANGE_REGEX = new RegExp(
  `^\\s*(${DATE_VALUE_PATTERN.source})\\s*(?:-|–|—|to)\\s*(Present|Current|${DATE_VALUE_PATTERN.source})\\s*$`,
  "i",
);

const DATE_RANGE_PATTERN = new RegExp(
  `(${DATE_VALUE_PATTERN.source})\\s*(?:-|–|—|to)\\s*(Present|Current|${DATE_VALUE_PATTERN.source})`,
  "i",
);

export const extractDateRange = (line) => {
  if (!line) {
    return null;
  }

  const cleanedLine = cleanLine(line);

  const match = cleanedLine.match(DATE_RANGE_PATTERN);

  if (!match) {
    return null;
  }

  const startDate = match[1].trim();
  const endDate = match[2].trim();

  const isCurrent = /^(present|current)$/i.test(endDate);

  return {
    startDate,
    endDate: isCurrent ? null : endDate,
    isCurrent,
    match: match[0],
    index: match.index,
  };
};


export const isDateRange = (line) => {
  if (!line) return false;

  return DATE_RANGE_REGEX.test(cleanLine(line));
};

/**
 * Parse a date range into start/end values.
 */
export const parseDateRange = (line) => {
  if (!line) return null;

  const cleanedLine = cleanLine(line);

  const match = cleanedLine.match(DATE_RANGE_REGEX);

  if (!match) {
    return null;
  }

  const startDate = match[1].trim();
  const endDate = match[2].trim();

  const isCurrent = /^(present|current)$/i.test(endDate);

  return {
    startDate,
    endDate: isCurrent ? null : endDate,
    isCurrent,
  };
};

export const findDateRange = (block) => {
  if (!Array.isArray(block)) {
    return null;
  }

  for (const line of block) {
    const dateRange = parseDateRange(line);

    if (dateRange) {
      return dateRange;
    }
  }

  return null;
};