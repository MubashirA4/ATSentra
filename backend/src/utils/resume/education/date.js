const EDUCATION_DATE_RANGE_REGEX =
  /\(?\s*(\d{4})\s*(?:-|–|—|to)\s*(Present|Current|\d{4})\s*\)?/i;

const EDUCATION_SINGLE_YEAR_REGEX =
  /\b(19|20)\d{2}\b/;

export const findEducationDateRange = (text) => {
  if (!text || typeof text !== "string") {
    return null;
  }

  const cleaned = text
    .trim()
    .replace(/\s+/g, " ");

  const rangeMatch = cleaned.match(
    EDUCATION_DATE_RANGE_REGEX,
  );

  if (rangeMatch) {
    const startDate = rangeMatch[1];
    const endValue = rangeMatch[2];

    const isCurrent =
      /^(present|current)$/i.test(endValue);

    return {
      startDate,
      endDate: isCurrent ? null : endValue,
      isCurrent,
    };
  }

  return null;
};

export const extractEducationDate = (lines) => {
  if (!Array.isArray(lines)) {
    return {
      startDate: null,
      endDate: null,
      isCurrent: false,
    };
  }

  const text = lines.join(" ");

  return (
    findEducationDateRange(text) || {
      startDate: null,
      endDate: null,
      isCurrent: false,
    }
  );
};