const PROFICIENCY_PATTERNS = [
  { value: "Native", pattern: /\bnative\b/i },
  { value: "Fluent", pattern: /\bfluent\b/i },
  { value: "Advanced", pattern: /\badvanced\b/i },
  { value: "Intermediate", pattern: /\bintermediate\b/i },
  { value: "Basic", pattern: /\bbasic\b/i },
  { value: "Beginner", pattern: /\bbeginner\b/i },
  { value: "Professional", pattern: /\bprofessional\b/i },
  { value: "Conversational", pattern: /\bconversational\b/i },
  { value: "Elementary", pattern: /\belementary\b/i },
];

export const extractProficiency = (text) => {
  for (const item of PROFICIENCY_PATTERNS) {
    if (item.pattern.test(text)) {
      return item.value;
    }
  }

  return null;
};