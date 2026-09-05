import { validateATSDecisionInput } from "./atsDecisionInputValidator.js";
import { validateResumeInput } from "../matching/validateResumeInput.js";
import { validateJobInput } from "../matching/validateJobInput.js";

export const validateATSDecisionRequest = (
  input,
) => {
  validateATSDecisionInput(input);

  const { job, candidates } = input;

  validateJobInput(job);

  candidates.forEach(
    (candidate, index) => {
      try {
        validateResumeInput(
          candidate.resume,
        );
      } catch (error) {
        throw new Error(
          `Invalid candidate resume at index ${index}: ${error.message}`,
        );
      }
    },
  );

  return true;
};