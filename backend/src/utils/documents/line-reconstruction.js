const BULLET_PATTERN = /^[•●▪◦○*-]\s+/;

const SENTENCE_END_PATTERN = /[.!?:;]$/;

const isBulletLine = (line) => { 
  return BULLET_PATTERN.test(line.trim());
};

const endsSentence = (line) => {
  return SENTENCE_END_PATTERN.test(line.trim());
};

const startsWithContinuationValue = (line) => {
  return /^(?:\d|[,.%$€£])/.test(line.trim());
};

export const shouldJoinLines = (previousLine, currentLine) => {
  if (!previousLine || !currentLine) {
    return false;
  }

  const previous = previousLine.trim();
  const current = currentLine.trim();

  // A new bullet means a new logical line.
  if (isBulletLine(current)) {
    return false;
  }

  // If previous line already ends a sentence,
  // current line is probably a new logical line.
  if (endsSentence(previous)) {
    return false;
  }

  // Lowercase continuation.
  if (/^[a-z]/.test(current)) {
    return true;
  }

  // Numeric continuation such as:
  // "20,000 monthly users."
  // "35% improvement."
  if (startsWithContinuationValue(current)) {
    return true;
  }

  return false;
};

export const reconstructLines = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return [];
  }

  const cleanedLines = lines
    .map((line) => line.trim())
    .filter(Boolean);

  const reconstructed = [];

  for (const line of cleanedLines) {
    const previousLine =
      reconstructed[reconstructed.length - 1];

    if (shouldJoinLines(previousLine, line)) {
      reconstructed[reconstructed.length - 1] =
        `${previousLine} ${line}`;
    } else {
      reconstructed.push(line);
    }
  }

  return reconstructed;
};