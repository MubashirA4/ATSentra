import { cleanLine } from "./textUtils.js";

const IMPACT_VERBS = [
  "improved",
  "increased",
  "decreased",
  "reduced",
  "optimized",
  "accelerated",
  "boosted",
  "enhanced",
  "achieved",
  "generated",
  "saved",
  "grew",
  "cut",
  "raised",
  "lowered",
];

const IMPACT_PHRASES = [
  "resulting in",
  "leading to",
  "which increased",
  "which reduced",
  "which improved",
  "which decreased",
  "resulted in",
  "led to",
];

const SCALE_ACTION_VERBS = [
  "built",
  "designed",
  "developed",
  "launched",
  "created",
  "delivered",
  "deployed",
  "implemented",
];

const SCALE_ACTION_PATTERN = new RegExp(
  `\\b(?:${SCALE_ACTION_VERBS.join("|")})\\b`,
  "i",
);

const SCALE_PATTERNS = [
  /\b\d[\d,]*(?:\.\d+)?\s*(?:k|m|million|billion)\b/i,
  /\b\d[\d,]*(?:\.\d+)?\s*\+?\s*(?:daily|monthly|annual|yearly|active|total)?\s*(?:users|customers|clients|requests|transactions|visits|downloads)\b/i,
];

const MONEY_PATTERN =
  /(?:[$€£¥]\s?\d[\d,]*(?:\.\d+)?|\d[\d,]*(?:\.\d+)?\s*(?:USD|EUR|GBP|PKR|JPY))\b/i;

const PERCENTAGE_PATTERN = /\b\d+(?:\.\d+)?\s*%/;

const COMPARISON_PATTERN = /\b(?:by|from|to)\s+\d+(?:\.\d+)?\s*%/i;

const RESULT_PATTERN = /\b(?:resulting|resulted|leading|led)\s+(?:in|to)\b/i;

const ACHIEVEMENT_VERB_PATTERN = new RegExp(
  `\\b(?:${IMPACT_VERBS.join("|")})\\b`,
  "i",
);

const IMPACT_PHRASE_PATTERN = new RegExp(
  `\\b(?:${IMPACT_PHRASES.join("|")})\\b`,
  "i",
);

export const getAchievementSignals = (line) => {
  const cleanedLine = cleanLine(line);

  if (!cleanedLine) {
    return [];
  }

  const signals = [];

  if (MONEY_PATTERN.test(cleanedLine)) {
    signals.push("monetary_value");
  }

  if (PERCENTAGE_PATTERN.test(cleanedLine)) {
    signals.push("percentage");
  }

  if (COMPARISON_PATTERN.test(cleanedLine)) {
    signals.push("percentage_comparison");
  }

  if (SCALE_PATTERNS.some((pattern) => pattern.test(cleanedLine))) {
    signals.push("scale");
  }

  if (ACHIEVEMENT_VERB_PATTERN.test(cleanedLine)) {
    signals.push("impact_verb");
  }

  if (IMPACT_PHRASE_PATTERN.test(cleanedLine)) {
    signals.push("impact_phrase");
  }

  if (RESULT_PATTERN.test(cleanedLine)) {
    signals.push("result_phrase");
  }

  return signals;
};

export const isLikelyAchievement = (line) => {
  const cleanedLine = cleanLine(line);

  if (!cleanedLine) {
    return false;
  }

  const signals = getAchievementSignals(cleanedLine);

  if (
    signals.includes("percentage") ||
    signals.includes("percentage_comparison") ||
    signals.includes("monetary_value")
  ) {
    return true;
  }

  const hasScale = signals.includes("scale");
  const hasScaleAction = SCALE_ACTION_PATTERN.test(cleanedLine);

  if (hasScale && hasScaleAction) {
    return true;
  }

  if (
    signals.includes("impact_phrase") ||
    signals.includes("result_phrase")
  ) {
    return true;
  }

  if (signals.includes("impact_verb") && hasScale) {
    return true;
  }

  return false;
};