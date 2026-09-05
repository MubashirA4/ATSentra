const MONTH =
  "(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";

const DATE =
  `(?:${MONTH}\\s+\\d{4}|\\d{4})`;

export const extractCertificationDates = (text) => {
  if (!text || typeof text !== "string") {
    return {
      issueDate: null,
      expiryDate: null,
    };
  }

  const value = text.trim();

  const expiryMatch = value.match(
    new RegExp(
      `(?:expires?|expiry|expiration)\\s*:?\\s*(${DATE})`,
      "i"
    )
  );

  const issueMatch = value.match(
    new RegExp(
      `(?:issued?|issue|obtained|earned)\\s*:?\\s*(${DATE})`,
      "i"
    )
  );

  return {
    issueDate: issueMatch?.[1] ?? null,
    expiryDate: expiryMatch?.[1] ?? null,
  };
};