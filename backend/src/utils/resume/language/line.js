const LANGUAGE_PATTERN =
  /^(?:[A-Za-zÀ-ÿ]+(?:[\s-][A-Za-zÀ-ÿ]+)*)(?:\s*(?:[-–—:|()])\s*(?:native|fluent|advanced|intermediate|basic|beginner|professional|conversational|elementary))?$/i;

export const isLanguageLine = (line) => {
  if (!line || typeof line !== "string") {
    return false;
  }

  return LANGUAGE_PATTERN.test(
    line.trim().replace(/^[•●▪◦*-]\s*/, "")
  );
};