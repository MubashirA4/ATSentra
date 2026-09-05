const MONTHS = {
  january: 1,
  jan: 1,

  february: 2,
  feb: 2,

  march: 3,
  mar: 3,

  april: 4,
  apr: 4,

  may: 5,

  june: 6,
  jun: 6,

  july: 7,
  jul: 7,

  august: 8,
  aug: 8,

  september: 9,
  sep: 9,
  sept: 9,

  october: 10,
  oct: 10,

  november: 11,
  nov: 11,

  december: 12,
  dec: 12,
};

export const normalizeResumeDate = (value) => {
  if (!value) {
    return null;
  }

  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (
    cleaned === "present" ||
    cleaned === "current"
  ) {
    return null;
  }

  // January 2024 / Jan 2024
  const monthYearMatch = cleaned.match(
    /^([a-z]+)\s+(\d{4})$/
  );

  if (monthYearMatch) {
    const monthName = monthYearMatch[1];
    const year = Number(monthYearMatch[2]);

    const month = MONTHS[monthName];

    if (!month) {
      return null;
    }

    return {
      year,
      month,
      value: `${year}-${String(month).padStart(2, "0")}`,
    };
  }

  // 01/2024 or 01-2024
  const numericMonthYearMatch = cleaned.match(
    /^(\d{1,2})[/-](\d{4})$/
  );

  if (numericMonthYearMatch) {
    const month = Number(numericMonthYearMatch[1]);
    const year = Number(numericMonthYearMatch[2]);

    if (month < 1 || month > 12) {
      return null;
    }

    return {
      year,
      month,
      value: `${year}-${String(month).padStart(2, "0")}`,
    };
  }

  // 2024
  const yearMatch = cleaned.match(
    /^(\d{4})$/
  );

  if (yearMatch) {
    const year = Number(yearMatch[1]);

    return {
      year,
      month: null,
      value: `${year}`,
    };
  }

  return null;
};